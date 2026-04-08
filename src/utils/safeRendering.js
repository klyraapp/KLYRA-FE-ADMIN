import React from "react";

/**
 * Safely renders a component or a fallback.
 * Ensures the component is a valid React component type.
 *
 * @param {React.ComponentType|React.ReactNode} Component - Component to render
 * @param {Object} props - Props to pass to the component
 * @param {React.ReactNode} Fallback - Fallback to render if Component is invalid
 * @returns {React.ReactNode}
 */
export const safeRender = (Component, props = {}, Fallback = null) => {
  if (!Component) return Fallback;

  // Check if it's already a React element
  if (React.isValidElement(Component)) {
    return Component;
  }

  // Check if it's a valid component type (string for HTML tags, function for components, or object for memo/forwardRef)
  const isComponentType =
    typeof Component === "function" ||
    typeof Component === "string" ||
    (typeof Component === "object" && Component !== null);

  if (!isComponentType) {
    return Fallback;
  }

  try {
    return <Component {...props} />;
  } catch (error) {
    console.error("Error rendering component safely:", error);
    return Fallback;
  }
};

/**
 * Safely maps over an array, ensuring it's an array and providing a fallback UI.
 *
 * @param {Array} array - Array to map over
 * @param {Function} fn - Map function
 * @param {React.ReactNode} Fallback - Fallback to render if array is empty or invalid
 * @returns {React.ReactNode}
 */
export const safeMap = (array, fn, Fallback = null) => {
  if (Array.isArray(array) && array.length > 0) {
    try {
      return array.map(fn);
    } catch (error) {
      console.error("Error mapping array safely:", error);
      return Fallback;
    }
  }
  return Fallback;
};

/**
 * Safely retrieves a value with a fallback if the value is null, undefined, or empty string.
 *
 * @param {any} value - Value to check
 * @param {any} fallback - Fallback value
 * @returns {any}
 */
export const getSafeValue = (value, fallback = "-") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return value;
};

/**
 * Safely gets an icon component from a map and returns its element.
 *
 * @param {Object} iconMap - Map of icon names to components
 * @param {string} iconName - Name of the icon
 * @param {React.ReactNode} Fallback - Fallback to render if icon not found
 * @returns {React.ReactNode}
 */
export const getSafeIcon = (iconMap, iconName, Fallback = null) => {
  if (!iconMap || !iconName) return Fallback;
  const Icon = iconMap[iconName];
  if (!Icon) return Fallback;

  return safeRender(Icon, {}, Fallback);
};
