import { useState } from 'react';
import { useNavigate } from 'react-router';
import '../../styles/SearchPage.css';

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
    <form onSubmit={handleSearch} className="search-bar-form">
      <input 
        type="text" 
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="ENTER KEYWORD"
        className="search-input"
      />
      <button 
        type="submit" 
        className="search-submit-btn"
      >
        SEARCH →
      </button>
    </form>
  );
}
