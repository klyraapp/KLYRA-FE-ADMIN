/**
 * Header Normalization Utility
 * Converts flattened API response keys into human-friendly column headers
 * Supports nested objects, array indices, camelCase, and snake_case
 * Generic and reusable across all export contexts
 */

const CONTEXT_MAP = {
  userRolePermission: "Role",
  bookingServices: "Service",
  originalData: "",
  permissions: "Permission",
  createdAt: "Assigned At",
  updatedAt: "Updated At",
};

/**
 * Remove array indices from key
 * Example: "items[0].name" → "items.name"
 */
const removeArrayIndices = (key) => {
  return key.replace(/\[\d+\]/g, "");
};

/**
 * Convert camelCase or snake_case to spaced words
 * Example: "userName" → "user name", "user_name" → "user name"
 */
const toSpacedWords = (str) => {
  return str
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();
};

/**
 * Capitalize first letter of each word
 * Example: "user name" → "User Name"
 */
const capitalizeWords = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Apply context-aware transformations
 * Uses CONTEXT_MAP to enhance readability based on parent keys
 */
const applyContextMapping = (parts) => {
  const mapped = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const contextValue = CONTEXT_MAP[part];

    if (contextValue !== undefined) {
      if (contextValue === "") {
        continue;
      }
      mapped.push(contextValue);
    } else {
      const transformed = CONTEXT_MAP[part] || part;
      mapped.push(transformed);
    }
  }

  return mapped;
};

/**
 * Normalize a single flattened key into a human-readable label
 * Example: "userRolePermission[0].role.name" → "Role Name"
 */
export const normalizeHeaderKey = (key) => {
  if (!key || typeof key !== "string") {
    return key;
  }

  const withoutIndices = removeArrayIndices(key);

  const parts = withoutIndices.split(".");

  const contextMapped = applyContextMapping(parts);

  const lastPart = contextMapped[contextMapped.length - 1];

  if (contextMapped.length === 1) {
    const spaced = toSpacedWords(lastPart);
    return capitalizeWords(spaced);
  }

  const parentContext = contextMapped.slice(0, -1).join(" ");
  const fieldName = toSpacedWords(lastPart);

  const combined =
    parentContext &&
    !fieldName.toLowerCase().includes(parentContext.toLowerCase())
      ? `${parentContext} ${fieldName}`
      : fieldName;

  return capitalizeWords(combined);
};

/**
 * Normalize and translate headers in one pass
 * Returns: { originalKey: "Translated Normalized Label" }
 */
export const normalizeAndTranslateHeaders = async (
  keys,
  language,
  translateFn,
) => {
  const headers = {};

  for (const key of keys) {
    const normalizedKey = normalizeHeaderKey(key);
    const translatedLabel = await translateFn(normalizedKey, language);
    headers[key] = translatedLabel;
  }

  return headers;
};
