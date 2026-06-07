import { Link, useLocation } from 'react-router-dom';

export default function SideNavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-surface-container-low dark:bg-inverse-surface border-r-2 border-on-surface shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] hidden lg:flex flex-col fixed left-0 top-0 h-full z-40 w-64">
      <div className="p-6 border-b-2 border-on-surface border-dashed">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Newzlet Reader</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant">Daily Edition</p>
      </div>
      <div className="flex-grow py-4 flex flex-col gap-2 px-4">
        <Link to="/" className={`flex items-center gap-3 p-3 transition-all ${isActive('/') ? 'bg-primary-container text-on-primary-container font-bold border-2 border-on-surface rotate-[-1deg] hover:translate-x-1 brutalist-shadow' : 'text-on-surface-variant hover:bg-surface-variant hover:translate-x-1'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>home</span>
          <span className="font-label-caps text-label-caps">Home</span>
        </Link>
        <Link to="/search" className={`flex items-center gap-3 p-3 transition-all ${isActive('/search') ? 'bg-primary-container text-on-primary-container font-bold border-2 border-on-surface rotate-[-1deg] hover:translate-x-1 brutalist-shadow' : 'text-on-surface-variant hover:bg-surface-variant hover:translate-x-1'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
          <span className="font-label-caps text-label-caps">Search</span>
        </Link>
        <div className="pt-4 mt-2 border-t-2 border-on-surface border-dashed">
          <span className="px-3 font-label-caps text-label-caps text-xs text-outline">Categories</span>
        </div>
        <Link to="/category/technology" className={`flex items-center gap-3 p-3 transition-all ${isActive('/category/technology') ? 'bg-primary-container text-on-primary-container font-bold border-2 border-on-surface rotate-[-1deg] hover:translate-x-1 brutalist-shadow' : 'text-on-surface-variant hover:bg-surface-variant hover:translate-x-1'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>memory</span>
          <span className="font-label-caps text-label-caps">Tech</span>
        </Link>
        <Link to="/category/politics" className={`flex items-center gap-3 p-3 transition-all ${isActive('/category/politics') ? 'bg-primary-container text-on-primary-container font-bold border-2 border-on-surface rotate-[-1deg] hover:translate-x-1 brutalist-shadow' : 'text-on-surface-variant hover:bg-surface-variant hover:translate-x-1'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_balance</span>
          <span className="font-label-caps text-label-caps">Politics</span>
        </Link>
        <Link to="/category/international" className={`flex items-center gap-3 p-3 transition-all ${isActive('/category/international') ? 'bg-primary-container text-on-primary-container font-bold border-2 border-on-surface rotate-[-1deg] hover:translate-x-1 brutalist-shadow' : 'text-on-surface-variant hover:bg-surface-variant hover:translate-x-1'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>public</span>
          <span className="font-label-caps text-label-caps">International</span>
        </Link>
      </div>
      <div className="p-4 border-t-2 border-on-surface border-dashed flex flex-col gap-2">
        <button className="mt-4 bg-on-surface text-surface font-label-caps text-label-caps py-3 px-4 border-2 border-on-surface shadow-[4px_4px_0px_0px_#facc15] btn-press transition-all uppercase tracking-wider">
          Get Print Version
        </button>
      </div>
    </nav>
  );
}
