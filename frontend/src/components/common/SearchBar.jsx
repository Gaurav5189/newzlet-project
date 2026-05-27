import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '600px' }}>
      <input 
        type="text" 
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="ENTER KEYWORD"
        className="grog-pill grog-border font-archivo"
        style={{
          flex: 1,
          padding: '1rem 1.5rem',
          fontSize: '1.2rem',
          outline: 'none',
          background: 'white'
        }}
      />
      <button 
        type="submit" 
        className="grog-pill grog-border font-archivo"
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          background: 'var(--cat-technology)',
          color: 'white',
          textShadow: '2px 2px 0 #000'
        }}
      >
        SEARCH →
      </button>
    </form>
  );
}
