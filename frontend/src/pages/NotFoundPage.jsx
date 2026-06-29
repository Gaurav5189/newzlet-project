import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export function loader() {
  return new Response("Not Found", { status: 404 });
}

export default function NotFound() {
  return (
    <main className="container page-container" style={{ padding: '4rem var(--margin-mobile)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Helmet>
        <title>Page Not Found - The Daily Newzlet</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="neo-shadow text-center" style={{ padding: '4rem 2rem', backgroundColor: 'var(--surface-container)', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
        <h1 className="text-display-lg text-uppercase rotate-slight-neg" style={{ marginBottom: '1rem' }}>404</h1>
        <p className="text-headline-sm mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--on-surface-variant)' }}>Lost Somewhere?</p>
        <p className="text-body-lg" style={{ marginBottom: '3rem' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="archive-btn text-label-caps font-bold" style={{ display: 'inline-block', marginTop: '2rem' }}>
          Return Home
        </Link>
      </div>
    </main>
  );
}
