import { useArticles } from '../hooks/useArticles';
import { useCategoryArticles } from '../hooks/useCategoryArticles';
import ArticleCard from '../components/common/ArticleCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

export default function HomePage() {
  const { data, isLoading } = useArticles();
  const { data: factData, isLoading: isFactLoading } = useCategoryArticles('day-fact', 1);

  // Filter out the day-fact articles from the main general feed
  const articles = (data?.results || []).filter(
    article => article.category?.slug !== 'day-fact'
  );

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const sideArticles = articles.length > 2 ? articles.slice(1, 3) : [];
  const latestArticles = articles.length > 3 ? articles.slice(3, 6) : [];

  const dayFactArticle = factData?.results?.[0];

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
              <h3 className="text-headline-md text-uppercase">
                {dayFactArticle?.category?.name || 'Day Fact'}
              </h3>
              <span className="material-symbols-outlined text-headline-md">ink_pen</span>
            </div>
            {isFactLoading ? (
              <div className="skeleton-day-fact">
                <div className="skeleton-icon skeleton-block mb-2"></div>
                <div className="skeleton-title skeleton-block"></div>
                <div className="skeleton-text skeleton-block"></div>
                <div className="skeleton-text short skeleton-block"></div>
              </div>
            ) : dayFactArticle ? (
              <>
                <p className="text-headline-md mb-2" style={{ color: 'var(--on-surface-variant)' }}>
                  {new Date(dayFactArticle.published_at).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-body-md">
                  {dayFactArticle.title}
                </p>
              </>
            ) : (
              <p className="text-body-md">No fact for today.</p>
            )}
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      {isLoading ? (
        <>
          <section className="bento-grid">
            <div className="bento-featured">
              <SkeletonCard variant="featured" />
            </div>
            <div className="bento-sidebar">
              <SkeletonCard variant="side" />
              <SkeletonCard variant="side" />
            </div>
          </section>
          <section>
            <div className="latest-clippings-header">
              <h2 className="text-headline-lg">Latest Clippings</h2>
              <div className="header-line"></div>
              <Link to="/search" viewTransition className="archive-btn text-label-caps font-bold">
                See All Archive
              </Link>
            </div>
            <div className="latest-grid">
              <SkeletonCard variant="no-image" />
              <SkeletonCard variant="no-image" />
              <SkeletonCard variant="no-image" />
            </div>
          </section>
        </>
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
              <Link to="/search" viewTransition className="archive-btn text-label-caps font-bold">
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
