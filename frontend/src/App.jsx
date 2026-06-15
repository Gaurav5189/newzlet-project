import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ModalProvider } from './context/ModalContext';
import TopAppBar from './components/layout/TopAppBar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ArticleModal from './components/common/ArticleModal';
import ContactPage from './pages/ContactPage';
import EditorialPage from './pages/EditorialPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

const RootLayout = () => (
  <div className="main-content">
    <ScrollRestoration />
    <TopAppBar />
    <div className="flex-grow">
      <div className="page-transition-wrapper">
        <Outlet />
      </div>
    </div>
    <Footer />
    <ArticleModal />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "category/:slug", element: <CategoryPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "editorial", element: <EditorialPage /> },
      { path: "privacy", element: <PrivacyPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);

export default function App() {
  return (
    <HelmetProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </HelmetProvider>
  );
}
