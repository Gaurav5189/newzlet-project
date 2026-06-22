/**
 * Optimizes external image URLs using wsrv.nl proxy.
 */
export function getOptimizedImageUrl(url, width = 600) {
  if (!url) return '';

  // Return local, base64, or blob URLs as-is
  if (
    url.startsWith('/') ||
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('http://localhost') ||
    url.startsWith('https://localhost')
  ) {
    return url;
  }

  // Skip SVGs
  if (url.toLowerCase().endsWith('.svg') || url.includes('.svg?')) {
    return url;
  }

  // Proxy image with webp output and specified width
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=80`;
}
