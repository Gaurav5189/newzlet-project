import { Link, useLocation } from 'react-router-dom';
import '../../styles/TopAppBar.css';

export default function TopAppBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="top-app-bar">
      <Link to="/" className="top-app-bar-brand text-headline-md font-headline-md">
        The Daily Newzlet
      </Link>
      <nav className="top-app-bar-nav">
        <Link 
          to="/category/international" 
          className={`nav-link text-label-caps ${isActive('/category/international') ? 'active' : ''}`}
        >
          International
        </Link>
        <Link 
          to="/category/technology" 
          className={`nav-link text-label-caps ${isActive('/category/technology') ? 'active' : ''}`}
        >
          Tech Bites
        </Link>
        <Link 
          to="/category/politics" 
          className={`nav-link text-label-caps ${isActive('/category/politics') ? 'active' : ''}`}
        >
          Local Scoop
        </Link>
        <Link 
          to="/search" 
          className={`nav-link text-label-caps ${isActive('/search') ? 'active' : ''}`}
        >
          Archive
        </Link>
      </nav>
    </header>
  );
}
