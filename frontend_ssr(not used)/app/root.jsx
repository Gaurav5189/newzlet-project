import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  useNavigation,
} from "react-router";

import "./styles/globals.css";
import "./styles/typography.css";
import { ModalProvider } from "./context/ModalContext";
import TopAppBar from "./components/layout/TopAppBar";
import Footer from "./components/layout/Footer";
import ArticleModal from "./components/common/ArticleModal";
import { getBreaking, getCategories } from "./services/api";

export async function loader() {
  try {
    const [breakingArticles, categoriesData] = await Promise.all([
      getBreaking().catch(() => []),
      getCategories().catch(() => [])
    ]);
    const categories = Array.isArray(categoriesData?.results) ? categoriesData.results : (Array.isArray(categoriesData) ? categoriesData : []);
    return { breakingArticles, categories };
  } catch (error) {
    return { breakingArticles: [], categories: [] };
  }
}

export async function clientLoader() {
  try {
    const [breakingArticles, categoriesData] = await Promise.all([
      getBreaking().catch(() => []),
      getCategories().catch(() => [])
    ]);
    const categories = Array.isArray(categoriesData?.results) ? categoriesData.results : (Array.isArray(categoriesData) ? categoriesData : []);
    return { breakingArticles, categories };
  } catch (error) {
    return { breakingArticles: [], categories: [] };
  }
}

export function links() {
  return [
    { rel: "preconnect", href: "https://wsrv.nl" }
  ];
}

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  const isTransitioning = navigation.state !== "idle";

  return (
    <ModalProvider>
      <div className="main-content">
        {isTransitioning && <div className="global-progress-bar" />}
        <TopAppBar />
        <div className="flex-grow">
          <div className="page-transition-wrapper">
            <Outlet />
          </div>
        </div>
        <Footer />
        <ArticleModal />
      </div>
    </ModalProvider>
  );
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
