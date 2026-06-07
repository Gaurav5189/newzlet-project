import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : '/api',
  timeout: 10000,
});

export const getBreaking          = ()               => api.get('/articles/breaking/').then(res => res.data);
export const getCategories        = ()               => api.get('/categories/').then(res => res.data);
export const getCategoryArticles  = (slug, page = 1) => api.get(`/categories/${slug}/articles/?page=${page}`).then(res => res.data);
export const searchArticles       = (params)         => api.get('/search/', { params }).then(res => res.data);
export const getArticles          = (page = 1)       => api.get(`/articles/?page=${page}`).then(res => res.data);
