import { useBreaking } from '../../hooks/useBreaking';

export default function BreakingTicker() {
  const { data: articles, isLoading } = useBreaking();

  if (isLoading || !articles || articles.length === 0) return null;

  const tickerText = articles.map(a => a.title).join(' • ');

  return (
    <div style={{
      background: 'var(--ticker-bg)',
      color: 'var(--ticker-text)',
      padding: '0.5rem 0',
      borderBottom: 'var(--border-width) solid var(--border)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="font-archivo" style={{
        padding: '0 1rem',
        whiteSpace: 'nowrap',
        zIndex: 10,
        background: 'var(--ticker-bg)',
        borderRight: 'var(--border-width) solid var(--ticker-text)'
      }}>
        ⚡ BREAKING
      </div>
      <div className="marquee-container" style={{ flex: 1, paddingLeft: '1rem' }}>
        <div className="marquee-content font-dm" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          {tickerText} • {tickerText}
        </div>
      </div>
    </div>
  );
}
