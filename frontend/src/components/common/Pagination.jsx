export default function Pagination({ count, next, previous, currentPage, setPage }) {
  if (!count || count <= 12) return null;
  
  const totalPages = Math.ceil(count / 12);
  const pages = Array.from({length: totalPages}, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '3rem' }}>
      <button 
        disabled={!previous}
        onClick={() => setPage(currentPage - 1)}
        className="grog-pill grog-border font-archivo" 
        style={{ padding: '0.5rem 1rem', background: 'white', opacity: previous ? 1 : 0.5 }}
      >
        ← PREV
      </button>
      
      {pages.map(p => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className="grog-pill grog-border font-archivo"
          style={{
            padding: '0.5rem 1rem',
            background: p === currentPage ? 'var(--border)' : 'white',
            color: p === currentPage ? 'white' : 'var(--border)'
          }}
        >
          {p}
        </button>
      ))}

      <button 
        disabled={!next}
        onClick={() => setPage(currentPage + 1)}
        className="grog-pill grog-border font-archivo" 
        style={{ padding: '0.5rem 1rem', background: 'white', opacity: next ? 1 : 0.5 }}
      >
        NEXT →
      </button>
    </div>
  );
}
