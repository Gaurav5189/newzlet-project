import { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [activeArticle, setActiveArticle] = useState(null);

  const openArticle = (article) => {
    setActiveArticle(article);
  };

  const closeArticle = () => {
    setActiveArticle(null);
  };

  return (
    <ModalContext.Provider value={{ activeArticle, openArticle, closeArticle }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
