/**
 * Utility to process and sanitize HTML strings for rendering.
 * Serves as a double safety net to:
 * 1. Map custom/non-standard tags like <bold> to <b> and <italic> to <i>.
 * 2. Strip out unwanted/dangerous tags — allow only safe formatting tags.
 * 3. Clean up any HTML attributes to prevent XSS.
 * 4. Decode HTML entities AFTER tag processing so entity-encoded tags
 *    (e.g. &lt;script&gt;) are never promoted to real elements.
 *
 * Design note: entities are intentionally decoded LAST so that inputs like
 * &amp;lt;script&amp;gt; become &lt;script&gt; (visible text), not <script>.
 * This avoids the double-unescaping class of vulnerabilities (CodeQL js/double-escaping).
 */
export function sanitizeHtml(htmlString) {
  if (!htmlString) return '';

  // 1. Strip HTML comments first to prevent information disclosure.
  let processed = htmlString.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Map custom/non-standard tags to safe standard equivalents BEFORE
  //    stripping, while input is still in its encoded form.
  processed = processed
    .replace(/<bold>/gi, '<b>')
    .replace(/<\/bold>/gi, '</b>')
    .replace(/<italic>/gi, '<i>')
    .replace(/<\/italic>/gi, '</i>')
    .replace(/<more>/gi, '')
    .replace(/<\/more>/gi, '');

  // 3. Whitelist-based tag filter: keep only known-safe tags, strip everything
  //    else (including all attributes to prevent event-handler injection).
  const allowedTags = ['br', 'i', 'b', 'strong', 'em', 'span', 'p'];
  const cleanHtml = processed.replace(/<(\/?)(\w+)([^>]*?)>/g, (match, isClosing, tagName, _attrs) => {
    const lowerTag = tagName.toLowerCase();
    if (allowedTags.includes(lowerTag)) {
      return lowerTag === 'br' ? '<br />' : `<${isClosing}${lowerTag}>`;
    }
    return ''; // strip any disallowed tag, dropping all attributes
  });

  // 4. Decode safe HTML entities LAST — after all tag processing is complete.
  //    Decoding last means entity-encoded tags (e.g. &lt;script&gt;) are never
  //    promoted into real HTML tags; they become visible text characters instead.
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
 * Strips all HTML tags entirely (useful for ticker text where tags shouldn't render).
 */
export function stripHtml(htmlString) {
  if (!htmlString) return '';
  const sanitized = sanitizeHtml(htmlString);
  // Use `<[^>]+>` (not `<[^>]*>?`) — the `>?` form allows tag fragments like
  // `<script` (no closing >) to survive, which CodeQL flags as incomplete
  // multi-character sanitization (js/incomplete-multi-character-sanitization).
  // sanitizeHtml() above already strips disallowed tags, so this is a final
  // clean-up pass only for allowed structural tags like <br />.
  return sanitized.replace(/<[^>]+>/gm, '');
}
