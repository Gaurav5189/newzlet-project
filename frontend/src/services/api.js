const envBase = import.meta.env.VITE_API_BASE_URL || '';
const baseURL = envBase
  ? (envBase.endsWith('/api') ? envBase : `${envBase}/api`)
  : '/api';

let apiVersion = '';
export const setApiVersion = (v) => { apiVersion = v; };

const fetchApi = async (endpoint, options = {}) => {
  const urlStr = `${baseURL}${endpoint}`;
  let finalUrl = urlStr;
  if (apiVersion && !endpoint.includes('news-version')) {
    const separator = urlStr.includes('?') ? '&' : '?';
    finalUrl = `${urlStr}${separator}v=${apiVersion}`;
  }

  const response = await fetch(finalUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    let errorMessage = `API error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage += ` - ${errorBody.message || errorBody.detail || JSON.stringify(errorBody)}`;
    } catch {
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
  // Forward real visitor IP for backend rate-limiting when called from SSR
  const headers = clientIp ? { 'cf-connecting-ip': clientIp } : {};
  return fetchApi(`/search/?${query.toString()}`, { headers });
};
export const getArticles          = (page = 1, pageSize = 12) => fetchApi(`/articles/?page=${page}&page_size=${pageSize}`);
export const submitContactForm    = (data)           => fetchApi('/contact/', { method: 'POST', body: JSON.stringify(data) });
export const getNewsVersion       = ()               => fetchApi('/news-version/');

