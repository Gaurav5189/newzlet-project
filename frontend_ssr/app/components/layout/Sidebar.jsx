import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import '../../styles/Sidebar.css';

export default function Sidebar({ isOpen, onClose, categories = [] }) {
  // Store the body overflow value that existed before the sidebar ever opened
  const originalOverflowRef = useRef(null);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      // Capture original value only on first open (before we change it)
      if (originalOverflowRef.current === null) {
        originalOverflowRef.current = document.body.style.overflow;
      }
      document.body.style.overflow = 'hidden';
    } else {
      // Restore only if we previously captured a value
      if (originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current;
        originalOverflowRef.current = null;
      }
    }
    return () => {
      // On unmount, restore if the sidebar was open
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
          <Link to="/contact" className="sidebar-link text-title-md" onClick={onClose} style={{ marginTop: '2rem' }}>
            Contact Me
          </Link>
        </div>
      </div>
    </>
  );
}
