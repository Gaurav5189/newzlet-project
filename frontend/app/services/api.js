const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
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
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

export const getBreaking          = ()               => fetchApi('/articles/breaking/');
export const getCategories        = ()               => fetchApi('/categories/');
export const getCategoryArticles  = (slug, page = 1) => fetchApi(`/categories/${slug}/articles/?page=${page}`);
export const searchArticles       = (params)         => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) query.append(k, String(v));
  });
  return fetchApi(`/search/?${query.toString()}`);
};
export const getArticles          = (page = 1, pageSize = 12) => fetchApi(`/articles/?page=${page}&page_size=${pageSize}`);
