/**
 * Sanitizes HTML strings for safe rendering.
 */
export function sanitizeHtml(htmlString) {
  if (!htmlString) return '';

  // Remove HTML comments
  let processed = htmlString.replace(/<!--[\s\S]*?-->/g, '');

  // Map non-standard tags to standard HTML equivalents
  processed = processed
    .replace(/<bold>/gi, '<b>')
    .replace(/<\/bold>/gi, '</b>')
    .replace(/<italic>/gi, '<i>')
    .replace(/<\/italic>/gi, '</i>')
    .replace(/<more>/gi, '')
    .replace(/<\/more>/gi, '');

  // Whitelist safe formatting tags only
  const allowedTags = ['br', 'i', 'b', 'strong', 'em', 'span', 'p'];
  const cleanHtml = processed.replace(/<(\/?)(\w+)([^>]*?)>/g, (match, isClosing, tagName, _attrs) => {
    const lowerTag = tagName.toLowerCase();
    if (allowedTags.includes(lowerTag)) {
      return lowerTag === 'br' ? '<br />' : `<${isClosing}${lowerTag}>`;
    }
    return ''; // strip any disallowed tag, dropping all attributes
  });

  // Decode safe HTML entities last to prevent tag injection
  const decoded = cleanHtml
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&'); // &amp; must be last to avoid double-decoding

  return decoded;
}

/**
 * Strips all HTML tags.
 */
export function stripHtml(htmlString) {
  if (!htmlString) return '';
  const sanitized = sanitizeHtml(htmlString);
  // Strip any remaining structural tags
  return sanitized.replace(/<[^>]+>/gm, '');
}
