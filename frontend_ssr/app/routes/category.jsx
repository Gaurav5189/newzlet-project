import { useLoaderData, useSearchParams, useRouteLoaderData } from 'react-router';
import { getCategoryArticles } from '../services/api';
import ArticleCard from '../components/common/ArticleCard';
import Pagination from '../components/common/Pagination';
import '../styles/CategoryPage.css';

async function loadCategoryData({ params, request }) {
  const slug = params.slug;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  try {
    const articlesData = await getCategoryArticles(slug, page).catch(() => ({ results: [], count: 0 }));
    return { articlesData, page, slug, oneDayAgo: oneDayAgo.toISOString(), error: null };
  } catch (error) {
    return { articlesData: { results: [], count: 0 }, page, slug, oneDayAgo: oneDayAgo.toISOString(), error: 'Failed to load category data' };
  }
}

export async function loader({ params, request }) {
  return loadCategoryData({ params, request });
}

export async function clientLoader({ params, request }) {
  return loadCategoryData({ params, request });
}

export default function Category() {
  const { articlesData, page, slug, oneDayAgo: oneDayAgoISO } = useLoaderData();
  const [, setSearchParams] = useSearchParams();

  const rootData = useRouteLoaderData("root") || {};
  const categoriesData = rootData.categories || [];
  const category = categoriesData.find((c) => c.slug === slug);
  const articles = articlesData?.results || [];

  const oneDayAgo = new Date(oneDayAgoISO);

  const todayArticles = articles.filter(
    (article) => new Date(article.published_at) >= oneDayAgo
  );
  const olderArticles = articles.filter(
    (article) => new Date(article.published_at) < oneDayAgo
  );

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set('page', newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="container category-page">
      <section className="category-header">
        <h1 className="text-display-lg text-uppercase tracking-tight">
          {category?.name || slug}
        </h1>
      </section>

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
            {olderArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        </section>
      )}

      {articlesData && (articlesData.next || articlesData.previous) && (
          <div style={{ marginTop: '2rem' }}>
            <Pagination
              count={articlesData.count}
              next={articlesData.next}
              previous={articlesData.previous}
              currentPage={page}
              setPage={handlePageChange}
            />
          </div>
      )}
    </main>
  );
}
