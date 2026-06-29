import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';
import ArticleCard from '../components/common/ArticleCard';
import SkeletonCard from '../components/common/SkeletonCard';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import { Helmet } from 'react-helmet-async';
import '../styles/SearchPage.css';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const { data, isLoading, error } = useSearch({ q, category, page });

  const [currentQuery, setCurrentQuery] = useState(`${q}-${category}`);

  // Reset page to 1 whenever the search query or category changes.
  // useEffect (not render-phase setState) is the correct React idiom here.
  useEffect(() => {
    const newQuery = `${q}-${category}`;
    if (newQuery !== currentQuery) {
      setCurrentQuery(newQuery);
      setPage(1);
    }
  }, [q, category, currentQuery]);

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

  return (
    <main className="container search-page">
      <Helmet>
        <title>{q ? `Search results for "${q}"` : "Search"} - The Daily Newzlet</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="search-header">
        <h1 className="text-display-lg text-uppercase rotate-slight-neg">
          Search Results
        </h1>
        <SearchBar />
      </div>

      <section>
        {isLoading ? (
          <div className="search-results-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-body-lg text-error">
            Error loading search results. Please try again.
          </p>
        ) : !q && !category ? (
          <p className="text-body-lg text-on-surface-variant">
            Enter a search term or select a category to find articles.
          </p>
        ) : (
          <>
            <div className="search-results-grid">
              {data?.results?.map(article => (
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
