import { Link } from 'react-router';
import '../../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer mt-auto">
      <div className="footer-brand font-headline-md text-headline-md">The Daily Newzlet</div>
      <nav className="footer-nav">
        <Link to="#" className="footer-link font-body-md text-body-md">Editorial Policy</Link>
        <Link to="#" className="footer-link font-body-md text-body-md">Privacy</Link>
        <Link to="#" className="footer-link font-body-md text-body-md">Terms</Link>
        <Link to="#" className="footer-link font-body-md text-body-md">Contact</Link>
      </nav>
      <p className="footer-copy font-body-md text-body-md text-sm">
        © 2026 The Daily Newzlet.
      </p>
    </footer>
  );
}
