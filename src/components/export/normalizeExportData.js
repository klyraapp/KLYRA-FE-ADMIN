/**
 * normalizeExportData
 * Flattens nested objects and arrays for export
 * Handles null/undefined values gracefully
 */

export const normalizeExportData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const flattenObject = (obj, prefix = "", maxDepth = 3, currentDepth = 0) => {
    const flattened = {};

    if (currentDepth >= maxDepth) {
      return { [prefix || "data"]: JSON.stringify(obj) };
    }

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        flattened[newKey] = "";
      } else if (key === "extraServices" && Array.isArray(value)) {
        if (value.length === 0) {
          flattened[newKey] = "None";
        } else {
          const serviceNames = value
            .map((service) => service?.name || "Unknown")
            .filter(Boolean)
            .join(", ");
          flattened[newKey] = serviceNames || "None";
        }
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          flattened[newKey] = "";
        } else if (typeof value[0] === "object" && value[0] !== null) {
          if (value.length <= 3) {
            value.forEach((item, index) => {
              const nestedFlat = flattenObject(
                item,
                `${newKey}[${index}]`,
                maxDepth,
                currentDepth + 1,
              );
              Object.assign(flattened, nestedFlat);
            });
          } else {
            flattened[newKey] = `${value.length} items`;
          }
        } else {
          flattened[newKey] = value.join(", ");
        }
      } else if (typeof value === "object" && value !== null) {
        if (value instanceof Date) {
          flattened[newKey] = value.toISOString();
        } else {
          const nestedFlat = flattenObject(
            value,
            newKey,
            maxDepth,
            currentDepth + 1,
          );
          Object.assign(flattened, nestedFlat);
        }
      } else if (typeof value === "boolean") {
        flattened[newKey] = value ? "Yes" : "No";
      } else if (typeof value === "number") {
        flattened[newKey] = value;
      } else {
        flattened[newKey] = String(value);
      }
    });

    return flattened;
  };

  try {
    return data.map((item) => flattenObject(item));
  } catch (error) {
    throw new Error(
      `Data normalization failed: ${error.message || "Unknown error"}`,
    );
  }
};
