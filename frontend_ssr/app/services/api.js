const isServer = typeof window === 'undefined';

// Guard against double /api if env var already ends with /api
const ensureApiPath = (url) => url.endsWith('/api') ? url : `${url}/api`;

let baseURL = '/api';

if (import.meta.env.VITE_API_BASE_URL) {
  // Production or explicitly set absolute URL
  baseURL = ensureApiPath(import.meta.env.VITE_API_BASE_URL);
} else if (isServer) {
  // Node.js SSR requires an absolute URL. We bypass the proxy and hit the target directly.
  baseURL = import.meta.env.VITE_DEV_PROXY_TARGET
    ? ensureApiPath(import.meta.env.VITE_DEV_PROXY_TARGET)
    : 'http://localhost:5173/api';
}

const fetchApi = async (endpoint, options = {}) => {
  const { headers, ...restOptions } = options;
  const response = await fetch(`${baseURL}${endpoint}`, {
    cache: 'no-store',
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...headers,
    },
  });
  if (!response.ok) {
    let errorMessage = `API error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage += ` - ${errorBody.message || errorBody.detail || JSON.stringify(errorBody)}`;
    } catch {
      // Response body is not JSON, use status text only
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const getBreaking = () => fetchApi('/articles/breaking/');
export const getCategories = () => fetchApi('/categories/');
export const getCategoryArticles = (slug, page = 1) => fetchApi(`/categories/${encodeURIComponent(slug)}/articles/?page=${page}`);
export const searchArticles = (params, clientIp = null) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') query.append(k, String(v));
  });
  // When called from the SSR loader, forward the real visitor IP so Django's
  // CloudflareAnonThrottle keys on the correct per-person IP, not the Worker IP.
  const headers = clientIp ? { 'cf-connecting-ip': clientIp } : {};
  return fetchApi(`/search/?${query.toString()}`, { headers });
};
export const getArticles = (page = 1, pageSize = 12) => fetchApi(`/articles/?page=${page}&page_size=${pageSize}`);
export const submitContactForm = (data) => fetchApi('/contact/', { method: 'POST', body: JSON.stringify(data) });
