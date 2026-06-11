import { Link } from "react-router";
import "../styles/HomePage.css"; // Reuse styling

export function meta() {
  return [
    { title: "Terms of Service | The Daily Newzlet" },
    { name: "description", content: "Terms of service for The Daily Newzlet." },
  ];
}

export default function TermsOfService() {
  return (
    <main className="container page-container" style={{ padding: '4rem var(--margin-mobile)' }}>
      <h1 className="text-display-md text-uppercase mb-4">Terms of Service</h1>
      <div className="neo-shadow" style={{ padding: '2rem', backgroundColor: 'var(--surface-container)' }}>
        <p className="text-body-lg mb-4">
          Newzlet is provided &apos;as is&apos; for informational purposes. By using this site, you acknowledge that we are not responsible for the accuracy, legality, or content of the external news articles linked.
        </p>
        <p className="text-body-lg mb-4">
          We operate under fair use by linking directly to the original source. Continued use of the site constitutes agreement to these terms.
        </p>
      </div>
    </main>
  );
}
