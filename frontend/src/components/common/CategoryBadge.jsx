import { Link } from 'react-router-dom';

export default function CategoryBadge({ category }) {
  if (!category) return null;
  
  return (
    <Link to={`/category/${category.slug}`} className="grog-pill grog-border font-archivo" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.2rem 0.8rem',
      fontSize: '0.8rem',
      background: category.color || 'var(--surface)',
      color: '#fff',
      textShadow: '1px 1px 0 #000'
    }}>
      <span>{category.emoji}</span>
      <span>{category.name}</span>
    </Link>
  );
}
