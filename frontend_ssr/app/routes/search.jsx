import { useLoaderData, useSearchParams } from 'react-router';
import { searchArticles } from '../services/api';
import ArticleCard from '../components/common/ArticleCard';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import '../styles/SearchPage.css';

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || '';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  // Forward visitor IP from Cloudflare header for rate-limiting
  const clientIp = request.headers.get('cf-connecting-ip') || '';

  try {
    const data = await searchArticles({ q, category, page }, clientIp).catch(() => ({ results: [], count: 0 }));
    return { data, q, category, page };
  } catch (error) {
    return { data: { results: [], count: 0 }, q, category, page };
  }
}

export async function clientLoader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || '';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  
  try {
    const data = await searchArticles({ q, category, page }).catch(() => ({ results: [], count: 0 }));
    return { data, q, category, page };
  } catch (error) {
    return { data: { results: [], count: 0 }, q, category, page };
  }
}

export default function Search() {
  const { data, q, category, page } = useLoaderData();
  const [, setSearchParams] = useSearchParams();

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set('page', newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="container search-page">
      <div className="search-header">
        <h1 className="text-display-lg text-uppercase rotate-slight-neg">
          Search Results
        </h1>
        <SearchBar />
      </div>

      <section>
        {!q && !category ? (
          <p className="text-body-lg text-on-surface-variant">
            Enter a search term or select a category to find articles.
          </p>
        ) : (
          <>
            <div className="search-results-grid">
              {data?.results?.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {data?.results?.length === 0 && (
              <p className="text-body-lg text-on-surface-variant text-center" style={{ margin: '3rem 0' }}>
                No articles found. Try a different search term or category.
              </p>
            )}

            {data?.results && data.results.length > 0 && (
              <Pagination
                count={data?.count}
                next={data?.next}
                previous={data?.previous}
                currentPage={page}
                setPage={handlePageChange}
              />
            )}
          </>
        )}
      </section>
    </main>
  );
}
