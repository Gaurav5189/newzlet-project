export default function ShareButtons({ url, title }) {
  const shareData = {
    title,
    url: url || window.location.href,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied!');
    } catch (err) {
      alert('Failed to copy link. Please copy manually.');
    }
  };

  const btnStyle = {
    padding: '0.4rem',
    background: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px'
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button className="grog-pill grog-border" style={{...btnStyle, background: '#1DA1F2', color: 'white'}} onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`)}> 
        𝕏
      </button>
      <button className="grog-pill grog-border" style={{...btnStyle, background: '#25D366', color: 'white'}} onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareData.title + ' ' + shareData.url)}`)}> 
        💬
      </button>
      <button className="grog-pill grog-border" style={{...btnStyle}} onClick={handleCopy}>
        📋
      </button>
    </div>
  );
}
