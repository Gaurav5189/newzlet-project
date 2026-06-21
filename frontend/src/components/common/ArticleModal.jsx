import { useModal } from '../../context/ModalContext';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { sanitizeHtml } from '../../utils/html';
import { getOptimizedImageUrl } from '../../utils/image';
import { IconClose, IconSync, IconLightbulb, IconArrowForward, IconCategory } from './Icons';
import '../../styles/ArticleModal.css';

// Only allow 6-digit hex colors from Django backend (e.g. #F59E0B).
const getSafeColor = (color) => {
  if (!color) return 'var(--secondary-container)';
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : 'var(--secondary-container)';
};

export default function ArticleModal() {
  const { activeArticle, closeArticle } = useModal();
  const prevArticleIdRef = useRef(activeArticle ? activeArticle.id : null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const currentId = activeArticle?.id ?? null;
    if (currentId !== prevArticleIdRef.current) {
      prevArticleIdRef.current = currentId;
      setImageError(false);
      setImageLoading(true);
    }
  }, [activeArticle?.id]);

  if (!activeArticle) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeArticle();
    }
  };

  const renderBodyParagraphs = (text) => {
    if (!text) return null;
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    return paragraphs.map((p, idx) => {
      const sanitizedP = sanitizeHtml(p);
      if (idx === 0) {
        // Guard against empty string after sanitization
        const trimmed = sanitizedP.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('<')) {
          return (
            <p key={idx} className="first-paragraph" dangerouslySetInnerHTML={{ __html: trimmed }} />
          );
        }
        // Extract first visible character, skipping any leading whitespace
        const match = trimmed.match(/^(\s*)(.)/);
        if (!match) return <p key={idx} dangerouslySetInnerHTML={{ __html: sanitizedP }} />;

        const firstLetter = match[2];
        const restOfText = trimmed.slice(match[0].length);
        return (
          <p key={idx} className="first-paragraph">
            <span className="dropcap">{firstLetter}</span>
            <span dangerouslySetInnerHTML={{ __html: restOfText }} />
          </p>
        );
      }
      return <p key={idx} dangerouslySetInnerHTML={{ __html: sanitizedP }} />;
    });
  };

  // Get category name safely depending on API structure
  const getCategoryName = () => {
    if (typeof activeArticle.category === 'object' && activeArticle.category !== null) {
      return activeArticle.category.name;
    }
    return activeArticle.category_slug || 'General';
  };

  const getCategorySlug = () => {
    if (typeof activeArticle.category === 'object' && activeArticle.category !== null) {
      return activeArticle.category.slug;
    }
    return activeArticle.category_slug || 'general';
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">

        {/* Close Button */}
        <button className="modal-close-btn" onClick={closeArticle} aria-label="Close modal">
          <div className="wobbly-border">
            <IconClose className="font-bold" />
          </div>
        </button>

        {/* Article Header */}
        <div className="modal-meta">
          <span 
            className="category-pill font-label-caps rotate-slight-neg border-2 border-on-surface"
            style={{ backgroundColor: getSafeColor(activeArticle.category?.color) }}
          >
            {getCategoryName()}
          </span>
          <span className="font-body-md text-body-md text-on-surface-variant italic">
            {(() => {
              if (!activeArticle.published_at) return 'Date unavailable';
              const date = new Date(activeArticle.published_at);
              return isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString('en-GB');
            })()}
          </span>
          <span className="modal-source-badge">
            Source: {activeArticle.source_name || 'The Global Ledger'}
          </span>
        </div>

        <h1 
          className="modal-title font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeArticle.title) }}
        />

        {/* Article Image */}
        {activeArticle.image_url && !imageError && (
          <div className="modal-image-container">
            <div className="modal-image-wrapper">
              {imageLoading && (
                <div className="article-image-loader">
                  <div className="article-image-loader-badge font-label-caps">
                    <IconSync className="loader-spin" />
                    <span>Inking Photo...</span>
                  </div>
                </div>
              )}
              <img 
                src={getOptimizedImageUrl(activeArticle.image_url, 1200)} 
                alt={activeArticle.title} 
                className={`modal-image ${imageLoading ? 'loading' : 'loaded'}`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageError(true)}
              />
            </div>
            <div className="modal-image-source">
              Source Photo
            </div>
          </div>
        )}

        {/* Why It Matters */}
        {activeArticle.ai_summary && (
          <div className="why-it-matters-box">
            <span className="why-it-matters-title text-label-caps">
              <IconLightbulb style={{ fontSize: '1.1rem', verticalAlign: 'text-bottom', marginRight: '4px' }} />
              Why It Matters
            </span>
            <p
              className="why-it-matters-text text-body-md"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeArticle.ai_summary) }}
            />
          </div>
        )}

        {/* Article Body */}
        <div className="modal-body">
          {renderBodyParagraphs(activeArticle.summary)}
        </div>

        {/* Action Area */}
        <div className="modal-footer">
          {(activeArticle.source_url?.startsWith('http://') || activeArticle.source_url?.startsWith('https://')) && (
            <a 
              href={activeArticle.source_url}
              target="_blank" 
              rel="noopener noreferrer"
              className="modal-action-btn"
            >
              <span>Read Full Source</span>
              <IconArrowForward />
            </a>
          )}
          <Link 
            to={`/category/${getCategorySlug()}`}
            onClick={closeArticle}
            className="modal-action-btn secondary"
          >
            <span>View More {getCategoryName()}</span>
            <IconCategory />
          </Link>
        </div>
      </div>
    </div>
  );
}
