import { Link } from 'react-router-dom';
import '../../styles/typography.css';

export default function Navbar() {
  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      borderBottom: 'var(--border-width) solid var(--border)', 
      display: 'flex', 
      gap: '1rem', 
      alignItems: 'center',
      background: 'var(--bg)'
    }}>
      <Link to="/" className="font-boogaloo" style={{ fontSize: '2.5rem', color: 'var(--text)', marginRight: '1rem' }}>
        NEWZLET!
      </Link>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link to="/" className="grog-pill grog-border font-archivo" style={{ padding: '0.4rem 1rem', background: 'var(--bg)', fontSize: '0.9rem' }}>HOME</Link>
        <Link to="/category/technology" className="grog-pill grog-border font-archivo" style={{ padding: '0.4rem 1rem', background: 'var(--bg)', fontSize: '0.9rem' }}>TECH</Link>
        <Link to="/category/politics" className="grog-pill grog-border font-archivo" style={{ padding: '0.4rem 1rem', background: 'var(--bg)', fontSize: '0.9rem' }}>POLITICS</Link>
        <Link to="/search" className="grog-pill grog-border font-archivo" style={{ padding: '0.4rem 1rem', background: 'var(--bg)', fontSize: '0.9rem' }}>SEARCH</Link>
      </div>
    </nav>
  );
}
