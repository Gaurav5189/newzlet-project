import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback } from 'react';
import { getNewsVersion, setApiVersion } from '../services/api';

const VERSION_POLL_INTERVAL = 3 * 60 * 1000; // 3 minutes

// Module-level channel — one instance shared across the whole app lifetime.
// All tabs on the same origin share this channel.
const broadcastChannel = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('newzlet-news-updates')
  : null;

/**
 * Polls /api/news-version/ every 3 minutes (only while the tab is visible).
 * Calls onNewVersion() when a new version is detected, both from the poll
 * and from a BroadcastChannel message sent by another tab.
 *
 * @param {object} options
 * @param {() => void} options.onNewVersion  Called when new content is available.
 * @returns {{ refreshAll: () => void }}  Call to invalidate all queries and pull fresh data.
 */
export function useNewsVersion({ onNewVersion }) {
  const queryClient = useQueryClient();

  // Stable ref for the last known version — avoids triggering effects on every render.
  const lastVersionRef = useRef(null);

  // Stable callback ref so the BroadcastChannel listener doesn't re-register on every render.
  const onNewVersionRef = useRef(onNewVersion);
  useEffect(() => { onNewVersionRef.current = onNewVersion; }, [onNewVersion]);

  const { data } = useQuery({
    queryKey: ['news-version'],
    queryFn: getNewsVersion,
    // Poll every 3 minutes, only when the tab is in the foreground.
    refetchInterval: VERSION_POLL_INTERVAL,
    refetchIntervalInBackground: false,
    // Treat the version as stale after the same interval so a window-focus
    // event also triggers a recheck.
    staleTime: VERSION_POLL_INTERVAL,
    // Never retry aggressively — a missed poll is fine, the next one will catch up.
    retry: 1,
  });

  // Detect version changes from our own poll.
  useEffect(() => {
    if (!data?.version) return;

    if (lastVersionRef.current === null) {
      // First load — set baseline. Do NOT show a banner.
      lastVersionRef.current = data.version;
      setApiVersion(data.version);
      return;
    }

    if (data.version !== lastVersionRef.current) {
      lastVersionRef.current = data.version;
      setApiVersion(data.version);
      onNewVersionRef.current();
      // Notify other open tabs so they show the banner immediately
      // instead of waiting for their own 3-minute poll.
      broadcastChannel?.postMessage({ type: 'news-updated', version: data.version });
    }
  }, [data]);

  // Listen for broadcasts from other tabs.
  useEffect(() => {
    if (!broadcastChannel) return;
    const handler = (event) => {
      if (event.data?.type === 'news-updated') {
        // Update our ref so we don't double-fire when our own poll runs next.
        lastVersionRef.current = event.data.version;
        setApiVersion(event.data.version);
        onNewVersionRef.current();
      }
    };
    broadcastChannel.addEventListener('message', handler);
    return () => broadcastChannel.removeEventListener('message', handler);
  }, []);

  // Invalidates dynamic news caches → refetches updated content from the server
  // without hammering static endpoints (like categories) at the same time.
  const refreshAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['articles'] });
    queryClient.invalidateQueries({ queryKey: ['category-articles'] });
    queryClient.invalidateQueries({ queryKey: ['breaking'] });
  }, [queryClient]);

  return { refreshAll };
}
