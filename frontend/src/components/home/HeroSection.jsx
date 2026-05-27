export default function HeroSection() {
  return (
    <section style={{
      padding: '4rem 2rem',
      borderBottom: 'var(--border-width) solid var(--border)',
      background: 'var(--surface)',
      textAlign: 'center'
    }}>
      <h1 className="font-boogaloo" style={{
        fontSize: 'clamp(4rem, 10vw, 8rem)',
        lineHeight: 1,
        margin: '0 0 1rem 0',
        textTransform: 'uppercase',
        textShadow: '4px 4px 0 #000',
        color: 'white',
        WebkitTextStroke: '3px black'
      }}>
        THE DAILY BLAST
      </h1>
      <p className="font-archivo" style={{ fontSize: '1.5rem', margin: 0 }}>
        YOUR NO-NONSENSE NEWS ROUNDUP
      </p>
    </section>
  );
}
