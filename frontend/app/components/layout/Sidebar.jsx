import { useEffect } from 'react';
import { Link } from 'react-router';
import '../../styles/Sidebar.css';

export default function Sidebar({ isOpen, onClose, categories = [] }) {
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose}></div>
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="text-headline-sm font-headline-sm">Categories</h2>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            &times;
          </button>
        </div>
        <div className="sidebar-content">
          <Link to="/" className="sidebar-link text-title-md" onClick={onClose}>
            Main Page
          </Link>
          <Link to="/search" className="sidebar-link text-title-md" onClick={onClose}>
            Search
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat.id || cat.slug} 
              to={`/category/${cat.slug}`} 
              className="sidebar-link text-title-md"
              onClick={onClose}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
