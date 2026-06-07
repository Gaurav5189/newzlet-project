import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { sanitizeHtml } from '../../utils/html';
import '../../styles/ArticleCard.css';

export default function ArticleCard({ article, variant = 'standard' }) {
  const { openArticle } = useModal();
  const [imageError, setImageError] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    openArticle(article);
  };

  // Dynamically resolve variant: if the article has no image URL or loading fails, fall back to 'no-image'
  const resolvedVariant = (!article.image_url || imageError) ? 'no-image' : variant;

  // We'll map the variant to specific CSS classes
  const getContainerClass = () => {
    switch (resolvedVariant) {
      case 'featured': return 'article-card featured wobbly-border neo-shadow';
      case 'side': return 'article-card side neo-shadow-sm rotate-slight-neg';
      case 'no-image': return 'article-card no-image brutalist-shadow-lg rotate-slight-pos';
      case 'standard': 
      default:
        return 'article-card standard brutalist-shadow-lg clipping-card';
    }
  };

  const getTitleClass = () => {
    switch (resolvedVariant) {
      case 'featured': return 'article-title font-headline-lg text-headline-lg';
      case 'side': return 'article-title font-headline-md text-body-lg font-bold'; // Slightly smaller for side
      default: return 'article-title font-headline-md text-headline-md leading-tight';
    }
  };

  if (resolvedVariant === 'no-image') {
    return (
      <Link 
        to={`/article/${article.slug || article.id}`} 
        className={getContainerClass()}
        onClick={handleClick}
      >
        <div className="article-content">
          <div className="article-no-image-icon">
            <span className="material-symbols-outlined">public</span>
          </div>
          <h3 className={getTitleClass()} dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.title) }} />
          <p className="article-excerpt font-body-md text-body-md" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.summary || article.excerpt) }} />
          <div className="article-footer">
            <span className="article-date-text font-label-caps text-label-caps">
               {new Date(article.published_at || '2026-05-28').toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/article/${article.slug || article.id}`} 
      className={getContainerClass()}
      onClick={handleClick}
    >
      <div className="article-image-wrapper">
        <img 
          src={article.image_url} 
          alt={article.title} 
          className="article-image"
          onError={() => setImageError(true)}
        />
      </div>

      <div className="article-content">
        <div className="article-meta">
          <span className={`category-pill font-label-caps ${resolvedVariant === 'featured' ? 'rotate-slight-neg border-2 border-on-surface' : ''}`}>
            {article.category_slug || (article.category?.name) || 'General'}
          </span>
          {resolvedVariant === 'featured' && (
            <span className="article-date font-label-caps text-label-caps">
              {new Date(article.published_at || '2026-05-28').toLocaleDateString('en-GB')}
            </span>
          )}
        </div>

        <h3 className={getTitleClass()} dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.title) }} />

        {resolvedVariant !== 'side' && (
          <p className="article-excerpt font-body-lg text-body-lg" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.summary || article.excerpt) }} />
        )}

        {resolvedVariant === 'featured' && (
          <div className="article-read-btn font-label-caps text-label-caps">
            READ FULL SOURCE <span className="material-symbols-outlined">arrow_right_alt</span>
          </div>
        )}

        {resolvedVariant === 'standard' && (
          <div className="article-footer">
            <span className="article-date-text font-label-caps text-label-caps">
               {new Date(article.published_at || '2026-05-28').toLocaleDateString('en-GB')}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
