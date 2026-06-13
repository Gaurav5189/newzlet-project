import { Link } from 'react-router';

export function loader() {
  return new Response("Not Found", { status: 404 });
}

export default function NotFound() {
  return (
    <main className="container pt-16 p-4 mx-auto text-center">
      <h1 className="text-display-lg text-uppercase rotate-slight-neg">404</h1>
      <p className="text-headline-md mb-8">This page doesn't exist.</p>
      <Link to="/" className="archive-btn text-label-caps font-bold">
        Return Home
      </Link>
    </main>
  );
}
