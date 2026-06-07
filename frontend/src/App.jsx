import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import TopAppBar from './components/layout/TopAppBar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ArticleModal from './components/common/ArticleModal';

const RootLayout = () => (
  <div className="main-content">
    <TopAppBar />
    <div className="flex-grow">
      <div className="page-transition-wrapper">
        <Outlet />
      </div>
    </div>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "category/:slug", element: <CategoryPage /> },
      { path: "search", element: <SearchPage /> }
    ]
  }
]);

export default function App() {
  return (
    <ModalProvider>
      <RouterProvider router={router} />
      <ArticleModal />
    </ModalProvider>
  );
}
