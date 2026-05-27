import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';
import ArticleCard from '../components/common/ArticleCard';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const { data, isLoading } = useSearch({ q, category, page });

  useEffect(() => {
    setPage(1); // Reset page on new search
  }, [q, category]);

  return (
    <main style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="font-boogaloo" style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>SEARCH RESULTS</h1>
        <SearchBar />
      </div>

      {isLoading ? (
        <p className="font-dm">Searching...</p>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {data?.results?.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          
          <Pagination 
            count={data?.count} 
            next={data?.next} 
            previous={data?.previous}
            currentPage={page}
            setPage={setPage}
          />
        </>
      )}
    </main>
  );
}
