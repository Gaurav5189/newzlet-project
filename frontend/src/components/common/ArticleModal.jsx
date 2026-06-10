import { useModal } from '../../context/ModalContext';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { sanitizeHtml } from '../../utils/html';
import '../../styles/ArticleModal.css';

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
    if (e.target.classList.contains('modal-overlay')) {
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
            <span className="material-symbols-outlined font-bold">close</span>
          </div>
        </button>

        {/* Article Header */}
        <div className="modal-meta">
          <span 
            className="category-pill font-label-caps rotate-slight-neg border-2 border-on-surface"
            style={{ backgroundColor: activeArticle.category?.color || 'var(--secondary-container)' }}
          >
            {getCategoryName()}
          </span>
          <span className="font-body-md text-body-md text-on-surface-variant italic">
            {activeArticle.published_at
              ? new Date(activeArticle.published_at).toLocaleDateString('en-GB')
              : 'Date unavailable'}
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
                    <span className="material-symbols-outlined loader-spin">sync</span>
                    <span>Inking Photo...</span>
                  </div>
                </div>
              )}
              <img 
                src={activeArticle.image_url} 
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

        {/* Article Body */}
        <div className="modal-body">
          {renderBodyParagraphs(activeArticle.summary)}
        </div>

        {/* Action Area */}
        <div className="modal-footer">
          <a 
            href={activeArticle.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="modal-action-btn"
          >
            <span>Read Full Source</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
          <Link 
            to={`/category/${getCategorySlug()}`}
            onClick={closeArticle}
            className="modal-action-btn secondary"
          >
            <span>View More {getCategoryName()}</span>
            <span className="material-symbols-outlined">category</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
