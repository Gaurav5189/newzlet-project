import { Link } from "react-router";
import "../styles/HomePage.css"; // Reuse some styles or generic container styles if available

export function meta() {
  return [
    { title: "Editorial Policy | The Daily Newzlet" },
    { name: "description", content: "Editorial policy for The Daily Newzlet." },
  ];
}

export default function EditorialPolicy() {
  return (
    <main className="container page-container" style={{ padding: '4rem var(--margin-mobile)' }}>
      <h1 className="text-display-md text-uppercase mb-4">Editorial Policy</h1>
      <div className="neo-shadow" style={{ padding: '2rem', backgroundColor: 'var(--surface-container)' }}>
        <p className="text-body-lg mb-4">
          Newzlet is an automated news aggregator. We do not write, edit, or endorse the articles displayed. 
          Our system automatically pulls headlines and summaries from publicly available RSS feeds to provide a centralized reading hub.
        </p>
        <p className="text-body-lg mb-4">
          All copyright and credit belong to the original publishers. If you are a publisher and wish to have your feed removed from our platform, please <Link to="/contact" className="font-bold text-primary" style={{textDecoration: 'underline'}}>contact us</Link>.
        </p>
      </div>
    </main>
  );
}
