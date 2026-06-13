import React from 'react';
import '../../styles/SkeletonCard.css';

export default function SkeletonCard({ variant = 'standard' }) {
  const getContainerClass = () => {
    switch (variant) {
      case 'featured': return 'skeleton-card featured';
      case 'side': return 'skeleton-card side';
      case 'no-image': return 'skeleton-card no-image';
      default: return 'skeleton-card standard';
    }
  };

  if (variant === 'no-image') {
    return (
      <div className={getContainerClass()}>
        <div className="skeleton-content">
          <div className="skeleton-icon skeleton-block mb-4" style={{ width: '2rem', height: '2rem' }}></div>
          <div className="skeleton-title skeleton-block"></div>
          <div className="skeleton-title short skeleton-block"></div>
          <div className="skeleton-text skeleton-block mt-4"></div>
          <div className="skeleton-text skeleton-block"></div>
          <div className="skeleton-text short skeleton-block"></div>
          <div className="skeleton-footer mt-auto pt-4" style={{ borderTop: 'none' }}>
            <div className="skeleton-tag skeleton-block" style={{ width: '120px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={getContainerClass()}>
      <div className="skeleton-image skeleton-block"></div>
      
      <div className="skeleton-content">
        {variant !== 'side' && (
          <div className="skeleton-tag skeleton-block mb-2"></div>
        )}
        
        <div className="skeleton-title skeleton-block"></div>
        <div className="skeleton-title short skeleton-block"></div>
        
        {variant !== 'side' && (
          <>
            <div className="skeleton-text skeleton-block mt-2"></div>
            <div className="skeleton-text skeleton-block"></div>
            <div className="skeleton-text short skeleton-block"></div>
          </>
        )}
        
        <div className="skeleton-footer">
          {variant === 'side' ? (
            <div className="skeleton-tag skeleton-block" style={{ width: '60px' }}></div>
          ) : (
            <>
              <div className="skeleton-tag skeleton-block" style={{ width: '100px' }}></div>
              <div className="skeleton-icon skeleton-block"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
