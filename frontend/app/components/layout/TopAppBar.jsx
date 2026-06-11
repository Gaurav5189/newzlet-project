import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useRouteLoaderData } from 'react-router';
import Sidebar from './Sidebar';
import '../../styles/TopAppBar.css';

export default function TopAppBar() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupTimeoutRef = useRef(null);

  const rootData = useRouteLoaderData("root") || {};
  const categories = (rootData.categories || []).filter(cat => cat.slug !== 'day-fact');

  const isActive = (path) => location.pathname === path;

  const handleMouseEnter = () => {
    clearTimeout(popupTimeoutRef.current);
    setIsPopupOpen(true);
  };
  const handleMouseLeave = () => {
    popupTimeoutRef.current = setTimeout(() => {
      setIsPopupOpen(false);
    }, 200); // 200ms delay to allow moving mouse into popup
  };

  // Clean up pending timeout on unmount to prevent setState on unmounted component
  useEffect(() => {
    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <header className="top-app-bar glassmorphic">
        <Link to="/" viewTransition={!isActive('/')} className="top-app-bar-brand text-headline-md font-headline-md">
          The Daily Newzlet
        </Link>
        <nav className="top-app-bar-nav">
          <Link 
            to="/" 
            viewTransition={!isActive('/')}
            className={`nav-link text-label-caps ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/category/international" 
            viewTransition={!isActive('/category/international')}
            className={`nav-link text-label-caps ${isActive('/category/international') ? 'active' : ''}`}
          >
            International
          </Link>
          <Link 
            to="/category/technology" 
            viewTransition={!isActive('/category/technology')}
            className={`nav-link text-label-caps ${isActive('/category/technology') ? 'active' : ''}`}
          >
            Tech Bites
          </Link>
          <Link 
            to="/category/sports" 
            viewTransition={!isActive('/category/sports')}
            className={`nav-link text-label-caps ${isActive('/category/sports') ? 'active' : ''}`}
          >
            Sports
          </Link>
          <Link 
            to="/search" 
            viewTransition={!isActive('/search')}
            className={`nav-link text-label-caps ${isActive('/search') ? 'active' : ''}`}
          >
            Search
          </Link>
        </nav>
        
        <div className="categories-wrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <button 
            className="categories-btn text-label-caps" 
            onClick={() => setIsSidebarOpen(true)}
          >
            Categories
          </button>
          
          {isPopupOpen && (
            <div className="categories-popup">
              <Link to="/" className="popup-link" onClick={() => setIsPopupOpen(false)}>
                Main Page
              </Link>
              {categories.map(cat => (
                <Link 
                  key={cat.id || cat.slug} 
                  to={`/category/${cat.slug}`} 
                  className="popup-link"
                  onClick={() => setIsPopupOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        categories={categories} 
      />
    </>
  );
}
