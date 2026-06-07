import { Link } from 'react-router-dom';

export default function CategoryBadge({ category }) {
  if (!category) return null;
  
  return (
    <Link 
      to={`/category/${category.slug}`} 
      className="font-label-caps text-label-caps text-[10px] border border-on-surface rounded-full px-3 py-1 bg-primary-container text-on-primary-container hover:bg-surface-bright hover:text-on-surface transition-colors inline-flex items-center gap-1"
    >
      <span>{category.emoji}</span>
      <span>{category.name}</span>
    </Link>
  );
}
