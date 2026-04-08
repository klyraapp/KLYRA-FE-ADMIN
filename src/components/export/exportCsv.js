/**
 * exportToCsv
 * Exports data to CSV format with translation support
 * Handles special characters and triggers auto-download
 */

import { normalizeAndTranslateHeaders } from "@/utils/normalizeHeaders";
import {
  getTranslatedHeaders,
  preloadTranslations,
  translateRowValues,
} from "@/utils/translationHelpers";

export const exportToCsv = async (data, filename, language = "en") => {
  if (!data || data.length === 0) {
    throw new Error("No data available for CSV export");
  }

  try {
    await preloadTranslations(language);

    const originalKeys = Object.keys(data[0]);

    const headerTranslations = await normalizeAndTranslateHeaders(
      originalKeys,
      language,
      async (normalizedKey, lang) => {
        const translations = await getTranslatedHeaders([normalizedKey], lang);
        return translations[normalizedKey];
      },
    );

    const translatedData = await Promise.all(
      data.map((row) => translateRowValues(row, language)),
    );

    const translatedHeaderLabels = originalKeys.map(
      (key) => headerTranslations[key],
    );

    const escapeCsvValue = (value) => {
      if (value === null || value === undefined) return "";

      const stringValue = String(value);
      const needsQuotes =
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n") ||
        stringValue.includes("\r");

      if (needsQuotes) {
        const escaped = stringValue.replace(/"/g, '""');
        return `"${escaped}"`;
      }

      return stringValue;
    };

    const csvContent = [
      translatedHeaderLabels.map(escapeCsvValue).join(","),
      ...translatedData.map((row) =>
        originalKeys.map((key) => escapeCsvValue(row[key])).join(","),
      ),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(`CSV export failed: ${error.message || "Unknown error"}`);
  }
};
