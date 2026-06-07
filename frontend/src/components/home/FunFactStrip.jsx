import { useCategoryArticles } from '../../hooks/useCategoryArticles';

export default function FunFactStrip() {
  const { data, isLoading } = useCategoryArticles('fun-fact', 1);

  if (isLoading || !data?.results?.length) return null;

  const fact = data.results[0];

  return (
    <section className="bg-tertiary-container text-on-tertiary-container py-16 px-margin-mobile lg:px-margin-desktop border-y-[3px] border-on-surface border-dashed flex flex-col items-center text-center gap-8 shadow-[0_6px_0_0_#1e1b19] -mx-margin-mobile lg:-mx-margin-desktop">
      <h2 className="font-display-lg text-display-lg-mobile lg:text-display-lg wobbly-underline">
        FUN FACT DAILY ✨
      </h2>
      
      <div className="bg-surface-bright text-on-surface p-8 max-w-3xl w-full border-[3px] border-on-surface brutalist-shadow-lg -rotate-1 transition-transform hover:rotate-0 hover:-translate-y-2">
        <h3 className="font-headline-md text-headline-md mb-4">
          {fact.title}
        </h3>
        <p className="font-body-lg text-body-lg">
          {fact.summary}
        </p>
      </div>
    </section>
  );
}
