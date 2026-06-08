import { useParams } from 'react-router-dom';
import { useCategoryArticles } from '../hooks/useCategoryArticles';
import { useCategories } from '../hooks/useCategories';
import ArticleCard from '../components/common/ArticleCard';
import SkeletonCard from '../components/common/SkeletonCard';
import Pagination from '../components/common/Pagination';
import '../styles/CategoryPage.css';
import { useState } from 'react';

export default function CategoryPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const { data: categoryData } = useCategories();
  const { data, isLoading } = useCategoryArticles(slug, page);

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
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="container category-page">
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
