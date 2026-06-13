const envBase = import.meta.env.VITE_API_BASE_URL || '';
const baseURL = envBase
  ? (envBase.endsWith('/api') ? envBase : `${envBase}/api`)
  : '/api';

const fetchApi = async (endpoint, options = {}) => {
  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
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

export const getBreaking          = ()               => fetchApi('/articles/breaking/');
export const getCategories        = ()               => fetchApi('/categories/');
export const getCategoryArticles  = (slug, page = 1) => fetchApi(`/categories/${encodeURIComponent(slug)}/articles/?page=${page}`);
export const searchArticles       = (params, clientIp = null) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') query.append(k, String(v));
  });
  // When called from the SSR loader, forward the real visitor IP so Django's
  // CloudflareAnonThrottle keys on the correct per-person IP, not the Worker IP.
  const headers = clientIp ? { 'cf-connecting-ip': clientIp } : {};
  return fetchApi(`/search/?${query.toString()}`, { headers });
};
export const getArticles          = (page = 1, pageSize = 12) => fetchApi(`/articles/?page=${page}&page_size=${pageSize}`);
export const submitContactForm    = (data)           => fetchApi('/contact/', { method: 'POST', body: JSON.stringify(data) });
