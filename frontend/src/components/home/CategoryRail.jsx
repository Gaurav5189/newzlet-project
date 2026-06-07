import { useCategoryArticles } from '../../hooks/useCategoryArticles';
import ArticleCard from '../common/ArticleCard';
import { Link } from 'react-router-dom';

export default function CategoryRail({ category }) {
  const { data, isLoading } = useCategoryArticles(category.slug, 1);

  if (isLoading || !data?.results?.length) return null;

  return (
    <section className="flex flex-col gap-8 py-8 border-b-2 border-on-surface border-dashed last:border-0">
      <div className="flex justify-between items-end mb-4">
        <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface wobbly-underline">
          {category.name.toUpperCase()}
        </h2>
        <Link 
          to={`/category/${category.slug}`} 
          className="font-label-caps text-label-caps text-on-surface hover:text-primary transition-colors hover:underline"
        >
          See All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {data.results.slice(0, 3).map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
