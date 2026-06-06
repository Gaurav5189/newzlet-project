import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCategoryArticles } from '../hooks/useCategoryArticles';
import { useCategories } from '../hooks/useCategories';
import ArticleCard from '../components/common/ArticleCard';
import Pagination from '../components/common/Pagination';
import BreakingTicker from '../components/common/BreakingTicker';

export default function CategoryPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const { data: categories } = useCategories();
  const { data, isLoading } = useCategoryArticles(slug, page);

  useEffect(() => {
    setPage(1);
  }, [slug]);

  const category = categories?.find(c => c.slug === slug);

  return (
    <main>
      <BreakingTicker />
      
      {category && (
        <div style={{ padding: '4rem 2rem', background: category.color, borderBottom: 'var(--border-width) solid var(--border)' }}>
          <h1 className="font-boogaloo" style={{ fontSize: '4rem', color: 'white', textShadow: '3px 3px 0 #000', margin: 0 }}>
            {category.emoji} {category.name.toUpperCase()}
          </h1>
        </div>
      )}

      <div style={{ padding: '2rem' }}>
        {isLoading ? (
          <p className="font-dm">Loading...</p>
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
      </div>
    </main>
  );
}
