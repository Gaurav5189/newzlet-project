import { useState, useCallback } from 'react';
import { useNewsVersion } from '../../hooks/useNewsVersion';
import '../../styles/NewsBanner.css';

/**
 * Floating banner that appears when the version-stamp poll detects new content.
 * Mounted once in RootLayout so it is visible across all pages.
 *
 * The user can:
 *  - Click "Refresh" → invalidates React Query caches, articles update in-place.
 *  - Click ✕       → dismiss without refreshing (banner won't reappear until
 *                     the next new version is detected).
 */
export default function NewsBanner() {
  const [visible, setVisible] = useState(false);

  const onNewVersion = useCallback(() => setVisible(true), []);
  const { refreshAll } = useNewsVersion({ onNewVersion });

  const handleRefresh = () => {
    setVisible(false);
    refreshAll();
  };

  if (!visible) return null;

  return (
    <div className="news-banner" role="status" aria-live="polite" aria-atomic="true">
      <span className="news-banner-text text-label-caps">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '1rem', verticalAlign: 'text-bottom' }}
          aria-hidden="true"
        >
          newspaper
        </span>
        Fresh stories just arrived
      </span>

      <div className="news-banner-actions">
        <button
          id="news-banner-refresh-btn"
          className="news-banner-refresh text-label-caps"
          onClick={handleRefresh}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '1rem', verticalAlign: 'text-bottom' }}
            aria-hidden="true"
          >
            refresh
          </span>
          Refresh
        </button>

        <button
          className="news-banner-dismiss"
          onClick={() => setVisible(false)}
          aria-label="Dismiss update notification"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '1rem' }}
            aria-hidden="true"
          >
            close
          </span>
        </button>
      </div>
    </div>
  );
}
