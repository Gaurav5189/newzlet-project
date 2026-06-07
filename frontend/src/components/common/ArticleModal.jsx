import { useModal } from '../../context/ModalContext';
import { useState, useEffect } from 'react';
import { sanitizeHtml } from '../../utils/html';
import '../../styles/ArticleModal.css';

export default function ArticleModal() {
  const { activeArticle, closeArticle } = useModal();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [activeArticle]);

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
        if (sanitizedP.startsWith('<')) {
          return (
            <p key={idx} className="first-paragraph" dangerouslySetInnerHTML={{ __html: sanitizedP }} />
          );
        }
        const firstLetter = sanitizedP.charAt(0);
        const restOfText = sanitizedP.slice(1);
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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        {/* Tape Decorations */}
        <div className="modal-tape-top"></div>

        {/* Close Button */}
        <button className="modal-close-btn" onClick={closeArticle} aria-label="Close modal">
          <div className="wobbly-border">
            <span className="material-symbols-outlined font-bold">close</span>
          </div>
        </button>

        {/* Article Header */}
        <div className="modal-meta">
          <span className="category-pill font-label-caps rotate-slight-neg border-2 border-on-surface">
            {getCategoryName()}
          </span>
          <span className="font-body-md text-body-md text-on-surface-variant italic">
            {new Date(activeArticle.published_at || '2026-05-28').toLocaleDateString('en-GB')}
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
              <img 
                src={activeArticle.image_url} 
                alt={activeArticle.title} 
                className="modal-image"
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
        </div>
      </div>
    </div>
  );
}
