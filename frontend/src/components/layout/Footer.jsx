export default function Footer() {
  return (
    <footer style={{ 
      padding: '2rem', 
      borderTop: 'var(--border-width) solid var(--border)', 
      background: 'var(--bg)',
      textAlign: 'center',
      marginTop: '4rem'
    }}>
      <p className="font-dm" style={{ fontWeight: 'bold' }}>
        © {new Date().getFullYear()} NEWSBLAST. Grogg-inspired daily news.
      </p>
    </footer>
  );
}
