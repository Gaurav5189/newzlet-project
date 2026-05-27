import { useCategoryArticles } from '../../hooks/useCategoryArticles';

export default function FunFactStrip() {
  const { data, isLoading } = useCategoryArticles('fun-fact', 1);

  if (isLoading || !data?.results?.length) return null;

  const fact = data.results[0];

  return (
    <section style={{
      padding: '4rem 2rem',
      borderBottom: 'var(--border-width) solid var(--border)',
      background: 'var(--cat-fun-fact)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '2rem'
    }}>
      <h2 className="font-boogaloo" style={{
        fontSize: '4rem',
        margin: 0,
        color: 'white',
        textShadow: '3px 3px 0 #000'
      }}>
        FUN FACT DAILY ✨
      </h2>
      
      <div className="grog-card grog-border" style={{
        background: 'white',
        padding: '3rem',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '8px 8px 0 rgba(0,0,0,1)'
      }}>
        <h3 className="font-archivo" style={{ fontSize: '2rem', marginBottom: '1rem', marginTop: 0 }}>
          {fact.title}
        </h3>
        <p className="font-dm" style={{ fontSize: '1.2rem', lineHeight: 1.6, margin: 0 }}>
          {fact.summary}
        </p>
      </div>
    </section>
  );
}
