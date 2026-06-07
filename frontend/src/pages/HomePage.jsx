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
  const baseArticles = (data?.results || []).filter(
    article => article.category?.slug !== 'day-fact'
  );

  // Safety measure: Ensure bento grid articles have images. We need 4 total (1 featured, 3 side)
  const bentoArticles = baseArticles.filter(a => a.image_url).slice(0, 4);
  
  const featuredArticle = bentoArticles.length > 0 ? bentoArticles[0] : null;
  const sideArticles = bentoArticles.length > 1 ? bentoArticles.slice(1, 4) : [];

  // Exclude bento articles from the latest section
  const bentoArticleIds = new Set(bentoArticles.map(a => a.id));
  
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  const recentArticles = baseArticles.filter(a => {
    if (bentoArticleIds.has(a.id)) return false;
    const pubDate = new Date(a.published_at);
    return pubDate >= oneDayAgo;
  });

  const groupedArticles = recentArticles.reduce((acc, article) => {
    const catName = article.category?.name || 'General';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(article);
    return acc;
  }, {});

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
              <SkeletonCard variant="side" />
            </div>
          </section>
          <section className="latest-clippings-section">
            <div className="category-group">
              <div className="category-group-header">
                <h2 className="text-headline-lg">Latest Clippings</h2>
                <div className="header-line"></div>
                <div className="category-label text-label-caps font-bold">Loading</div>
              </div>
              <div className="latest-grid">
                <SkeletonCard variant="no-image" />
                <SkeletonCard variant="no-image" />
                <SkeletonCard variant="no-image" />
              </div>
            </div>
            <div className="category-group" style={{ marginTop: '3rem' }}>
              <div className="category-group-header">
                <div className="header-line"></div>
                <div className="category-label text-label-caps font-bold">Loading</div>
              </div>
              <div className="latest-grid">
                <SkeletonCard variant="no-image" />
                <SkeletonCard variant="no-image" />
                <SkeletonCard variant="no-image" />
              </div>
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
          {Object.entries(groupedArticles).length > 0 ? (
            <section className="latest-clippings-section">
              {Object.entries(groupedArticles).map(([categoryName, catArticles], index) => (
                <div key={categoryName} className="category-group" style={{ marginTop: index > 0 ? '3rem' : '0' }}>
                  <div className="category-group-header">
                    {index === 0 && (
                      <h2 className="text-headline-lg" style={{ marginRight: '1rem' }}>Latest Clippings</h2>
                    )}
                    <div className="header-line"></div>
                    <div className="category-label text-label-caps font-bold">
                      {categoryName}
                    </div>
                  </div>
                  <div className="latest-grid">
                    {catArticles.map(article => (
                      <ArticleCard key={article.id} article={article} variant="standard" />
                    ))}
                  </div>
                </div>
              ))}
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
                <Link to="/search" viewTransition className="archive-btn text-label-caps font-bold">
                  See All Archive
                </Link>
              </div>
            </section>
          ) : (
            <section className="latest-clippings-section">
              <div className="category-group-header">
                <h2 className="text-headline-lg" style={{ marginRight: '1rem' }}>Latest Clippings</h2>
                <div className="header-line"></div>
              </div>
              <p className="text-body-md text-center" style={{ margin: '3rem 0' }}>No other clippings from the last 24 hours.</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                <Link to="/search" viewTransition className="archive-btn text-label-caps font-bold">
                  See All Archive
                </Link>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
