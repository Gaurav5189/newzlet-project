import { Link } from 'react-router-dom';
import '../../styles/ArticleCard.css';

export default function ArticleCard({ article, variant = 'standard' }) {
  // We'll map the variant to specific CSS classes
  const getContainerClass = () => {
    switch (variant) {
      case 'featured': return 'article-card featured wobbly-border neo-shadow';
      case 'side': return 'article-card side neo-shadow-sm rotate-slight-neg';
      case 'no-image': return 'article-card no-image brutalist-shadow-lg rotate-slight-pos';
      case 'standard': 
      default:
        return 'article-card standard brutalist-shadow-lg clipping-card';
    }
  };

  const getTitleClass = () => {
    switch (variant) {
      case 'featured': return 'article-title font-headline-lg text-headline-lg';
      case 'side': return 'article-title font-headline-md text-body-lg font-bold'; // Slightly smaller for side
      default: return 'article-title font-headline-md text-headline-md leading-tight';
    }
  };

  if (variant === 'no-image') {
    return (
      <Link to={`/article/${article.slug || article.id}`} className={getContainerClass()}>
        <div className="article-content justify-center">
          <div className="article-no-image-icon">
            <span className="material-symbols-outlined text-3xl">public</span>
          </div>
          <h3 className={getTitleClass()}>{article.title}</h3>
          <p className="article-excerpt font-body-md text-body-md">{article.summary || article.excerpt}</p>
          <div className="mt-4 font-label-caps text-label-caps flex items-center gap-1 hover:text-surface-bright">
            Read full analysis <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.slug || article.id}`} className={getContainerClass()}>
      <div className="article-image-wrapper">
        <img 
          src={article.image_url || 'https://via.placeholder.com/800x600?text=No+Image'} 
          alt={article.title} 
          className="article-image"
        />
      </div>

      <div className="article-content">
        <div className="article-meta">
          <span className={`category-pill font-label-caps ${variant === 'featured' ? 'rotate-slight-neg border-2 border-on-surface' : ''}`}>
            {article.category_slug || 'General'}
          </span>
          {variant === 'featured' && (
            <span className="article-date font-label-caps text-label-caps">
              {new Date(article.published_at || '2026-05-28').toLocaleDateString('en-GB')}
            </span>
          )}
        </div>

        <h3 className={getTitleClass()}>
          {article.title}
        </h3>

        {variant !== 'side' && (
          <p className="article-excerpt font-body-lg text-body-lg">
            {article.summary || article.excerpt}
          </p>
        )}

        {variant === 'featured' && (
          <div className="article-read-btn font-label-caps text-label-caps mt-auto">
            READ FULL SOURCE <span className="material-symbols-outlined">arrow_right_alt</span>
          </div>
        )}

        {variant === 'standard' && (
          <div className="article-footer">
            <span className="font-label-caps text-label-caps text-xs text-on-surface-variant">
               {new Date(article.published_at || '2026-05-28').toLocaleDateString('en-GB')}
            </span>
            <button className="hover:text-primary">
              <span className="material-symbols-outlined">bookmark_add</span>
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
