import '../../styles/SearchPage.css';

export default function Pagination({ count, next, previous, currentPage, setPage, pageSize = 12 }) {
  if (!count || count <= pageSize) return null;
  
  const totalPages = Math.ceil(count / pageSize);
  const pages = Array.from({length: totalPages}, (_, i) => i + 1);

  return (
    <div className="pagination-container">
      <div className="pagination-list">
        <button 
          disabled={!previous}
          onClick={() => setPage(Math.max(1, currentPage - 1))}
          className="pagination-btn inactive" 
        >
          ← Prev
        </button>
        
        {pages.map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`pagination-btn ${p === currentPage ? 'active' : 'inactive'}`}
          >
            {p}
          </button>
        ))}

        <button 
          disabled={!next}
          onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
          className="pagination-btn inactive" 
        >
          Next →
        </button>
      </div>
    </div>
  );
}
