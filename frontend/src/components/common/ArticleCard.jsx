import CategoryBadge from './CategoryBadge';
import ShareButtons from './ShareButtons';

export default function ArticleCard({ article }) {
  return (
    <article className="grog-card grog-border" style={{
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
      position: 'relative'
    }}>
      {article.image_url ? (
        <img src={article.image_url} alt={article.title} style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderBottom: 'var(--border-width) solid var(--border)'
        }} />
      ) : (
        <div style={{
          width: '100%',
          height: '200px',
          background: 'var(--surface)',
          borderBottom: 'var(--border-width) solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span className="font-archivo" style={{ opacity: 0.2, fontSize: '2rem' }}>NEWZLET</span>
        </div>
      )}
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <CategoryBadge category={article.category} />
          <span className="font-dm" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
            {new Date(article.published_at).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="font-archivo" style={{ fontSize: '1.4rem', margin: 0, lineHeight: 1.2 }}>
          {article.title}
        </h3>
        
        <p className="font-dm" style={{ 
          fontSize: '0.95rem', 
          lineHeight: 1.5, 
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: 0
        }}>
          {article.summary}
        </p>
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '2px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-dm" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
            ⏱️ {article.read_time} min read
          </span>
          <ShareButtons url={article.source_url} title={article.title} />
        </div>
        
        <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="grog-pill grog-border font-archivo" style={{
          display: 'block',
          textAlign: 'center',
          padding: '0.8rem',
          background: 'var(--ticker-bg)',
          color: 'var(--ticker-text)',
          marginTop: '0.5rem'
        }}>
          READ SOURCE →
        </a>
      </div>
    </article>
  );
}
