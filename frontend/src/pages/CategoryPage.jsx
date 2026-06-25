import { useParams, Navigate } from 'react-router-dom';
import { useCategoryArticles } from '../hooks/useCategoryArticles';
import { useCategories } from '../hooks/useCategories';
import ArticleCard from '../components/common/ArticleCard';
import SkeletonCard from '../components/common/SkeletonCard';
import Pagination from '../components/common/Pagination';
import { Helmet } from 'react-helmet-async';
import '../styles/CategoryPage.css';
import { useState, useEffect } from 'react';

export default function CategoryPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);

  // Reset page to 1 when navigating to a different category
  useEffect(() => {
    setPage(1);
  }, [slug]);

  const { data: categoryData } = useCategories();
  const { data, isLoading } = useCategoryArticles(slug, page);

  if (slug === 'day-fact') {
    return <Navigate to="/" replace />;
  }

  const category = categoryData?.find(c => c.slug === slug);
  const articles = data?.results || [];

  // Group by last 24 hours dynamically
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  const todayArticles = articles.filter(
    article => new Date(article.published_at) >= oneDayAgo
  );
  const olderArticles = articles.filter(
    article => new Date(article.published_at) < oneDayAgo
  );

  const handlePageChange = (newPage) => {
    const updateState = () => {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (document.startViewTransition) {
      document.startViewTransition(updateState);
    } else {
      updateState();
    }
  };

  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://newzlet.me';
  const canonicalUrl = `${siteOrigin}/category/${slug}`;

  const categoryJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category?.name || slug,
    "description": category?.description || `${category?.name || slug} news articles.`,
    "url": canonicalUrl
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": articles.map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": article.source_url || `${siteOrigin}/article/${article.slug || article.id}`,
      "name": article.title
    }))
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteOrigin}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category?.name || slug,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <main className="container category-page">
      <Helmet>
        <title>{category?.name || slug} News — The Daily Newzlet</title>
        <meta name="description" content={category?.description || `Latest breaking news in ${category?.name || slug}.`} />
        {slug === 'day-fact' ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : (
          <link rel="canonical" href={canonicalUrl} />
        )}
        <script type="application/ld+json">{JSON.stringify(categoryJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>
      <section className="category-header">
        <h1 className="text-display-lg text-uppercase tracking-tight">
          {category?.name || slug}
        </h1>

      </section>

      {isLoading ? (
        <section className="date-group">
          <div className="category-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      ) : (
        <>
          {todayArticles.length > 0 && (
            <section className="date-group">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 className="date-header text-headline-lg wobbly-underline">
                  TODAY - {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </h2>
                <span className="text-body-md" style={{ color: 'var(--on-surface-variant)', fontStyle: 'italic' }}>
                  (What's happened in the last 24hrs)
                </span>
              </div>
              <div className="category-grid">
                {todayArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                  />
                ))}
              </div>
            </section>
          )}

          {olderArticles.length > 0 && (
            <section className="date-group">
              <h2 className="date-header text-headline-lg wobbly-underline">
                OLDER CLIPPINGS
              </h2>
              <div className="category-grid">
                {olderArticles.map(article => (
                  <ArticleCard key={article.id} article={article} variant="standard" />
                ))}
              </div>
            </section>
          )}

          {data && data.count > data.results.length && (
            <div style={{ marginTop: '2rem' }}>
              <Pagination
                count={data.count}
                next={data.next}
                previous={data.previous}
                currentPage={page}
                setPage={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}
