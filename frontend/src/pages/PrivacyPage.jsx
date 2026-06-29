import { Link } from "react-router";
import "../styles/HomePage.css"; // Reuse styling
import { Helmet } from 'react-helmet-async';

export function meta() {
  return [
    { title: "Privacy Policy - The Daily Newzlet" },
    { name: "description", content: "Privacy policy for The Daily Newzlet." },
  ];
}

export default function PrivacyPolicy() {
  return (
    <main className="container page-container" style={{ padding: '4rem var(--margin-mobile)' }}>
      <Helmet>
        <title>Privacy Policy - The Daily Newzlet</title>
        <meta name="description" content="Privacy policy for The Daily Newzlet." />
      </Helmet>
      <h1 className="text-display-md text-uppercase mb-4">Privacy Policy</h1>
      <div className="neo-shadow" style={{ padding: '2rem', backgroundColor: 'var(--surface-container)' }}>
        <p className="text-body-lg mb-4">
          Newzlet respects your privacy. We do not sell your personal data. 
          We use standard local storage in your browser to save your bookmarks and interface preferences.
        </p>
        <p className="text-body-lg mb-4">
          Because our frontend is hosted on Cloudflare, standard anonymous network routing data is processed. 
          Clicking on full articles will take you to external third-party websites, which have their own privacy policies.
        </p>
      </div>
    </main>
  );
}
