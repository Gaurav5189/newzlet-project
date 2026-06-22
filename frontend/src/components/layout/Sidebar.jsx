import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Sidebar.css';

export default function Sidebar({ isOpen, onClose, categories = [] }) {
  const originalOverflowRef = useRef(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (isOpen) {
      if (originalOverflowRef.current === null) {
        originalOverflowRef.current = document.body.style.overflow;
      }
      document.body.style.overflow = 'hidden';
    } else {
      if (originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current;
        originalOverflowRef.current = null;
      }
    }
    return () => {
      if (originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current;
        originalOverflowRef.current = null;
      }
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
          <Link to="/" className={`sidebar-link text-title-md ${isActive('/') ? 'active' : ''}`} onClick={onClose}>
            Main Page
          </Link>
          <Link to="/search" className={`sidebar-link text-title-md ${isActive('/search') ? 'active' : ''}`} onClick={onClose}>
            Search
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat.id || cat.slug} 
              to={`/category/${cat.slug}`} 
              className={`sidebar-link text-title-md ${isActive(`/category/${cat.slug}`) ? 'active' : ''}`}
              onClick={onClose}
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/contact" className={`sidebar-link text-title-md ${isActive('/contact') ? 'active' : ''}`} onClick={onClose} style={{ marginTop: '2rem' }}>
            Contact Me
          </Link>
        </div>
      </div>
    </>
  );
}
