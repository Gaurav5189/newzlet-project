import { useArticles } from '../hooks/useArticles';
import ArticleCard from '../components/common/ArticleCard';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

export default function HomePage() {
  const { data, isLoading } = useArticles();

  const articles = data?.results || [];
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const sideArticles = articles.length > 2 ? articles.slice(1, 3) : [];
  const latestArticles = articles.length > 3 ? articles.slice(3, 6) : [];

  return (
    <main className="container home-page">
      {/* Hero Section & Fun Fact */}
      <section className="home-hero-section">
        <div>
          <h1 className="text-display-lg text-uppercase rotate-slight-neg">
            The Daily Newzlet
          </h1>
          <p className="text-body-lg hero-subtitle">
            Your No-Nonsense News Roundup, Hand-Inked Every Morning.
          </p>
        </div>

        <div className="fun-fact-container rotate-slight-pos">
          <div className="fun-fact-card neo-shadow hand-drawn-bubble">
            <div className="fun-fact-header">
              <span className="material-symbols-outlined text-headline-md">auto_awesome</span>
              <h3 className="text-headline-md text-uppercase">Fun Fact Daily</h3>
              <span className="material-symbols-outlined text-headline-md">ink_pen</span>
            </div>
            <p className="text-headline-md mb-2" style={{ color: 'var(--on-surface-variant)' }}>
              Did you know? Honey never spoils!
            </p>
            <p className="text-body-md">
              Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat. Truly amazing!
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      {isLoading ? (
        <p className="text-body-md text-center">Loading the morning paper...</p>
      ) : (
        <>
          <section className="bento-grid">
            <div className="bento-featured">
              {featuredArticle && (
                <ArticleCard article={featuredArticle} variant="featured" />
              )}
            </div>
            <div className="bento-sidebar">
              {sideArticles.map(article => (
                <ArticleCard key={article.id} article={article} variant="side" />
              ))}
            </div>
          </section>

          {/* Latest Clippings */}
          <section>
            <div className="latest-clippings-header">
              <h2 className="text-headline-lg">Latest Clippings</h2>
              <div className="header-line"></div>
              <Link to="/search" className="archive-btn text-label-caps font-bold">
                See All Archive
              </Link>
            </div>
            <div className="latest-grid">
              {latestArticles.map(article => (
                <ArticleCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
