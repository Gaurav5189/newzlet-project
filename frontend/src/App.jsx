import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import TopAppBar from './components/layout/TopAppBar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ArticleModal from './components/common/ArticleModal';

export default function App() {
  return (
    <ModalProvider>
      <BrowserRouter>
        <div className="main-content">
          <TopAppBar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
        <ArticleModal />
      </BrowserRouter>
    </ModalProvider>
  );
}
