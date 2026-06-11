import '../../styles/SearchPage.css';

export default function Pagination({ count, next, previous, currentPage, setPage }) {
  if (!count || count <= 12) return null;
  
  const totalPages = Math.ceil(count / 12);
  const pages = Array.from({length: totalPages}, (_, i) => i + 1);

  return (
    <div className="pagination-container">
      <div className="pagination-list">
        <button 
          disabled={!previous}
          onClick={() => setPage(currentPage - 1)}
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
          onClick={() => setPage(currentPage + 1)}
          className="pagination-btn inactive" 
        >
          Next →
        </button>
      </div>
    </div>
  );
}
