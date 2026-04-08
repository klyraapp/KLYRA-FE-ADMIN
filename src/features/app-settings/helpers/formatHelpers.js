/**
 * Format helpers for settings keys
 */

/**
 * Converts camelCase or snake_case to Title Case with spaces
 * @param {string} str 
 * @returns {string}
 */
export const humanizeKey = (str) => {
  if (!str) return '';

  // Replace underscores with spaces
  const withSpaces = str.replace(/_/g, ' ');

  // Handle camelCase transition: only add space between lowercase and uppercase
  const result = withSpaces.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Trim and capitalize first letter
  const trimmed = result.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};
