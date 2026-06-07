import { useBreaking } from '../../hooks/useBreaking';
import { stripHtml } from '../../utils/html';

export default function BreakingTicker() {
  const { data: articles, isLoading } = useBreaking();

  if (isLoading || !articles || articles.length === 0) return null;

  const tickerText = articles.map(a => stripHtml(a.title)).join(' • ');

  return (
    <div className="bg-primary-container text-on-primary-container border-y-[3px] border-on-surface py-2 flex items-center shadow-[0_4px_0_0_#1e1b19] -mx-margin-mobile lg:-mx-margin-desktop px-margin-mobile lg:px-margin-desktop">
      <div className="font-label-caps text-label-caps pr-4 z-10 bg-primary-container border-r-[3px] border-on-surface">
        ⚡ BREAKING
      </div>
      <div className="marquee-container overflow-hidden flex-1 pl-4 relative">
        <div className="marquee-content font-headline-md font-bold uppercase whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {tickerText} • {tickerText}
        </div>
      </div>
    </div>
  );
}
