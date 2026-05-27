import HeroSection from '../components/home/HeroSection';
import CategoryRail from '../components/home/CategoryRail';
import FunFactStrip from '../components/home/FunFactStrip';
import BreakingTicker from '../components/common/BreakingTicker';
import { useCategories } from '../hooks/useCategories';

export default function HomePage() {
  const { data: categories } = useCategories();

  return (
    <main>
      <BreakingTicker />
      <HeroSection />
      
      {categories?.map(cat => {
        if (cat.slug === 'fun-fact') return null;
        return <CategoryRail key={cat.slug} category={cat} />;
      })}
      
      <FunFactStrip />
    </main>
  );
}
