import { useCategoryArticles } from '../../hooks/useCategoryArticles';
import ArticleCard from '../common/ArticleCard';
import { Link } from 'react-router-dom';

export default function CategoryRail({ category }) {
  const { data, isLoading } = useCategoryArticles(category.slug, 1);

  if (isLoading || !data?.results?.length) return null;

  return (
    <section style={{ padding: '3rem 2rem', borderBottom: 'var(--border-width) solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <h2 className="font-boogaloo grog-pill grog-border" style={{ 
          fontSize: '3rem', 
          margin: 0, 
          background: category.color, 
          color: 'white', 
          padding: '0.5rem 2rem',
          textShadow: '2px 2px 0 #000'
        }}>
          {category.name}
        </h2>
        <Link to={`/category/${category.slug}`} className="font-archivo grog-pill grog-border" style={{ padding: '0.8rem 1.5rem', background: 'white' }}>
          SEE ALL →
        </Link>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        overflowX: 'auto', 
        paddingBottom: '1rem',
        scrollSnapType: 'x mandatory'
      }}>
        {data.results.slice(0, 4).map(article => (
          <div key={article.id} style={{ minWidth: '350px', width: '350px', scrollSnapAlign: 'start' }}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
