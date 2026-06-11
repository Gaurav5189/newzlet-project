import { useRouteLoaderData } from 'react-router';
import { stripHtml } from '../../utils/html';
import '../../styles/BreakingTicker.css';

export default function BreakingTicker() {
  const { breakingArticles } = useRouteLoaderData("root") || { breakingArticles: [] };
  const articles = breakingArticles || [];

  if (!articles || articles.length === 0) return null;

  const tickerText = articles.map(a => stripHtml(a.title)).join(' • ');

  return (
    <div className="breaking-ticker">
      <div className="breaking-ticker-label font-label-caps text-label-caps">
        ⚡ BREAKING
      </div>
      <div className="marquee-container">
        <div className="marquee-content font-headline-md">
          {tickerText} • {tickerText}
        </div>
      </div>
    </div>
  );
}
