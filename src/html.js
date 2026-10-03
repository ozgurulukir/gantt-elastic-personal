/**
 * @fileoverview HTML sanitization for user-supplied task data
 * @license MIT
 * @package GanttElastic
 */
import DOMPurify from 'dompurify';

/**
 * Sanitize untrusted HTML - strips scripts, event handlers and other active
 * content while keeping safe markup (links, emphasis, images, ...).
 * Used wherever a task field or option is rendered through v-html.
 *
 * @param {any} html
 * @returns {string} sanitized html
 */
export function sanitizeHtml(html) {
  return DOMPurify.sanitize(typeof html === 'string' ? html : String(html));
}
