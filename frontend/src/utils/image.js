/**
 * Utility to optimize external image URLs on the fly using wsrv.nl (images.weserv.nl).
 * It resizes, compresses, and converts third-party images to modern WebP format
 * and caches them on Cloudflare's global CDN.
 */
export function getOptimizedImageUrl(url, width = 600) {
  if (!url) return '';

  // Return local assets, base64 strings, or blobs as-is
  if (
    url.startsWith('/') ||
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('http://localhost') ||
    url.startsWith('https://localhost')
  ) {
    return url;
  }

  // Skip SVG graphics since they are vectors and don't need raster compression/resizing
  if (url.toLowerCase().endsWith('.svg') || url.includes('.svg?')) {
    return url;
  }

  // Construct wsrv.nl proxy URL:
  // - w=width (resizes the image width)
  // - output=webp (converts to modern, highly compressed WebP)
  // - q=80 (compression quality)
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=80`;
}
