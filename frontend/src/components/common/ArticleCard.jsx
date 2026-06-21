import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useModal } from '../../context/ModalContext';
import { sanitizeHtml } from '../../utils/html';
import { getOptimizedImageUrl } from '../../utils/image';
import { IconPublic, IconSync, IconArrowRightAlt } from './Icons';
import '../../styles/ArticleCard.css';

export default function ArticleCard({ article, variant = 'standard' }) {
  const { openArticle } = useModal();
  const prevArticleIdRef = useRef(article.id);
  const imgRef = useRef(null);
  const cardRef = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);

  const optimizedSrc = getOptimizedImageUrl(article.image_url, variant === 'featured' ? 800 : 400);

  // If the image is already loaded (e.g. from cache) by the time React mounts,
  // the onLoad event won't fire. We check .complete AND .src to handle this.
  // src must match to avoid acting on a cached complete state from a previous image.
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && optimizedSrc) {
      let isMatched;
      try {
        const absoluteOptimized = new URL(optimizedSrc, window.location.href).href;
        isMatched = imgRef.current.src === absoluteOptimized;
      } catch {
        isMatched = imgRef.current.src === optimizedSrc;
      }
      if (isMatched) {
        setImageLoading(false);
      }
    }
  }, [optimizedSrc]);

  useEffect(() => {
    if (article.id !== prevArticleIdRef.current) {
      prevArticleIdRef.current = article.id;
      setImageError(false);
      setImageLoading(true);
    }
  }, [article.id]);

  useEffect(() => {
    // Only observe if on a device that lacks hover
    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isMobile) return;

    // Capture the node now — React clears refs before cleanup runs on unmount,
    // so reading cardRef.current inside the return function would be null.
    const node = cardRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '-33% 0px -33% 0px',
        threshold: 0
      }
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      // disconnect() is safer than unobserve(node) — it always fires cleanly
      // even if the node has already been removed from the DOM.
      observer.disconnect();
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    // Pass the already-resolved optimizedSrc so the modal can reuse the cached URL
    // instead of computing a different width and triggering a new network request.
    openArticle({ ...article, cachedImageUrl: optimizedSrc });
  };

  // Dynamically resolve variant: if the article has no image URL or loading fails, fall back to 'no-image'
  const resolvedVariant = (!article.image_url || imageError) ? 'no-image' : variant;

  // We'll map the variant to specific CSS classes
  const getContainerClass = () => {
    let baseClass;
    switch (resolvedVariant) {
      case 'featured': baseClass = 'article-card featured wobbly-border neo-shadow'; break;
      case 'side': baseClass = 'article-card side neo-shadow-sm rotate-slight-neg'; break;
      case 'no-image': baseClass = 'article-card no-image brutalist-shadow-lg rotate-slight-pos'; break;
      case 'standard': 
      default:
        baseClass = 'article-card standard brutalist-shadow-lg clipping-card';
    }
    return isInView ? `${baseClass} in-view` : baseClass;
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
        ref={cardRef}
      >
        <div className="article-content">
          <div className="article-no-image-icon">
            <IconPublic />
          </div>
          <h3 className={getTitleClass()} dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.title) }} />
          <p className="article-excerpt font-body-md text-body-md" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.summary || article.excerpt) }} />
          <div className="article-footer">
            <span className="article-date-text font-label-caps text-label-caps">
               {article.published_at
                 ? new Date(article.published_at).toLocaleDateString('en-GB')
                 : 'Date unavailable'}
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
      ref={cardRef}
    >
      <div className="article-image-wrapper">
        {imageLoading && (
          <div className="article-image-loader">
            <div className="article-image-loader-badge font-label-caps">
              <IconSync className="loader-spin" />
              <span>Inking Photo...</span>
            </div>
          </div>
        )}
        <img 
          ref={imgRef}
          src={optimizedSrc} 
          alt={article.title} 
          loading={resolvedVariant === 'featured' ? 'eager' : 'lazy'}
          fetchPriority={resolvedVariant === 'featured' ? 'high' : 'auto'}
          style={{ aspectRatio: '16/9', width: '100%', objectFit: 'cover' }}
          className={`article-image ${imageLoading ? 'loading' : 'loaded'}`}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageError(true)}
        />
      </div>

      <div className="article-content">
        <div className="article-meta">
          <span 
            className={`category-pill font-label-caps ${resolvedVariant === 'featured' ? 'rotate-slight-neg border-2 border-on-surface' : ''}`}
          >
            {article.category?.name || article.category_slug || 'General'}
          </span>
          {resolvedVariant === 'featured' && (
            <span className="article-date font-label-caps text-label-caps">
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString('en-GB')
                : 'Date unavailable'}
            </span>
          )}
        </div>

        <h3 className={getTitleClass()} dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.title) }} />

        {resolvedVariant !== 'side' && (
          <p className="article-excerpt font-body-lg text-body-lg" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.summary || article.excerpt) }} />
        )}

        {resolvedVariant === 'featured' && (
          <div className="article-read-btn font-label-caps text-label-caps">
            READ FULL SOURCE <IconArrowRightAlt />
          </div>
        )}

        {resolvedVariant === 'standard' && (
          <div className="article-footer">
            <span className="article-date-text font-label-caps text-label-caps">
               {article.published_at
                 ? new Date(article.published_at).toLocaleDateString('en-GB')
                 : 'Date unavailable'}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
