export default function ShareButtons({ url, title }) {
  const shareData = {
    title,
    url: url || window.location.href,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareData.url);
    alert('Link copied!');
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
      <button className="grog-pill grog-border" style={{...btnStyle, background: '#1DA1F2', color: 'white'}} onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.title}`)}>
        𝕏
      </button>
      <button className="grog-pill grog-border" style={{...btnStyle, background: '#25D366', color: 'white'}} onClick={() => window.open(`https://wa.me/?text=${shareData.title} ${shareData.url}`)}>
        💬
      </button>
      <button className="grog-pill grog-border" style={{...btnStyle}} onClick={handleCopy}>
        📋
      </button>
    </div>
  );
}
