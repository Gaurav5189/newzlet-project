/**
 * Utility to process and sanitize HTML strings for rendering.
 * Serves as a double safety net to:
 * 1. Convert escaped tag entities (&lt;br&gt;, &lt;i&gt;, etc.) to actual tags.
 * 2. Map custom/non-standard tags like <bold> to <b> and <italic> to <i>.
 * 3. Strip out unwanted tags (like <more>) and allow only safe formatting tags (br, i, b, strong, em, span, p).
 * 4. Clean up any HTML attributes to prevent XSS.
 */
export function sanitizeHtml(htmlString) {
  if (!htmlString) return '';
  
  // 1. Unescape HTML entities first so we process actual tag characters
  let decoded = htmlString
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");

  // 2. Map custom/non-standard tags to standard tags
  decoded = decoded
    .replace(/<bold>/gi, '<b>')
    .replace(/<\/bold>/gi, '</b>')
    .replace(/<italic>/gi, '<i>')
    .replace(/<\/italic>/gi, '</i>')
    .replace(/<more>/gi, '')
    .replace(/<\/more>/gi, ''); // remove more tags entirely

  // 3. Regex-based tag sanitizer with whitelist of safe tags
  const allowedTags = ['br', 'i', 'b', 'strong', 'em', 'span', 'p'];
  
  const cleanHtml = decoded.replace(/<(\/?)(\w+)([^>]*?)>/g, (match, isClosing, tagName, attributes) => {
    const lowerTag = tagName.toLowerCase();
    if (allowedTags.includes(lowerTag)) {
      if (lowerTag === 'br') {
        return '<br />';
      }
      return `<${isClosing}${lowerTag}>`;
    }
    return ''; // strip any other tag
  });

  return cleanHtml;
}

/**
 * Strips all HTML tags entirely (useful for ticker text where tags shouldn't render).
 */
export function stripHtml(htmlString) {
  if (!htmlString) return '';
  const sanitized = sanitizeHtml(htmlString);
  return sanitized.replace(/<[^>]*>?/gm, '');
}
