/**
 * exportToPdf
 * Exports data to PDF format with translation support
 * Splits wide tables into multiple tables with ID column preserved
 */

import { normalizeAndTranslateHeaders } from "@/utils/normalizeHeaders";
import {
  getTranslatedHeaders,
  preloadTranslations,
  translateRowValues,
} from "@/utils/translationHelpers";

export const exportToPdf = async (data, filename, pageKey, language = "en") => {
  if (!data || data.length === 0) {
    throw new Error("No data available for PDF export");
  }

  try {
    const jsPDFModule = await import("jspdf");
    const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF || jsPDFModule;

    const autoTableModule = await import("jspdf-autotable");
    const autoTable = autoTableModule.default || autoTableModule;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

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

    const idKey = originalKeys.find(
      (key) =>
        key.toLowerCase().includes("id") ||
        key.toLowerCase().includes("number"),
    );

    const pageWidth = doc.internal.pageSize.getWidth();
    const margins = 20;
    const availableWidth = pageWidth - margins;
    const minColumnWidth = 20;

    const calculateColumnWidth = (key, columnData) => {
      const headerLabel = headerTranslations[key];
      const headerLength = headerLabel.length;
      const maxContentLength = Math.max(
        ...columnData.map((v) => String(v || "").length),
        headerLength,
      );

      if (
        key.toLowerCase().includes("extraservices") ||
        key.toLowerCase().includes("description")
      ) {
        const estimatedWidth = Math.max(maxContentLength * 1.5, 40);
        return Math.min(estimatedWidth, 80);
      }

      const estimatedWidth = Math.max(maxContentLength * 1.5, 15);
      return Math.min(estimatedWidth, 60);
    };

    const splitIntoTables = () => {
      const tables = [];
      const nonIdKeys = originalKeys.filter((key) => key !== idKey);
      let currentIndex = 0;

      while (currentIndex < nonIdKeys.length) {
        const tableKeys = idKey ? [idKey] : [];
        const columnWidths = [];
        let currentWidth = 0;

        if (idKey) {
          const idData = translatedData.map((row) => row[idKey]);
          const idWidth = calculateColumnWidth(idKey, idData);
          columnWidths.push(idWidth);
          currentWidth += idWidth;
        }

        while (
          currentIndex < nonIdKeys.length &&
          currentWidth < availableWidth - minColumnWidth
        ) {
          const key = nonIdKeys[currentIndex];
          const columnData = translatedData.map((row) => row[key]);
          const width = calculateColumnWidth(key, columnData);

          if (currentWidth + width <= availableWidth) {
            tableKeys.push(key);
            columnWidths.push(width);
            currentWidth += width;
            currentIndex++;
          } else {
            break;
          }
        }

        if (tableKeys.length > (idKey ? 1 : 0)) {
          tables.push({ keys: tableKeys, widths: columnWidths });
        } else if (currentIndex < nonIdKeys.length) {
          const key = nonIdKeys[currentIndex];
          const columnData = translatedData.map((row) => row[key]);
          const width = Math.min(
            calculateColumnWidth(key, columnData),
            availableWidth - (idKey ? columnWidths[0] : 0),
          );
          tableKeys.push(key);
          columnWidths.push(width);
          tables.push({ keys: tableKeys, widths: columnWidths });
          currentIndex++;
        }
      }

      return tables;
    };

    const tables = splitIntoTables();

    const title = pageKey
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(title, 14, 15);

    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 21);
    doc.text(`Total Records: ${translatedData.length}`, 14, 26);

    let startY = 32;

    tables.forEach((table, tableIndex) => {
      const { keys, widths } = table;

      const translatedHeaders = keys.map((key) => headerTranslations[key]);

      const rows = translatedData.map((row) =>
        keys.map((key) => {
          const value = row[key];
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          return stringValue.length > 100
            ? stringValue.substring(0, 97) + "..."
            : stringValue;
        }),
      );

      const columnStyles = {};
      keys.forEach((key, index) => {
        columnStyles[index] = {
          cellWidth: widths[index],
          overflow: "linebreak",
          cellPadding: 2,
        };
      });

      if (tableIndex > 0) {
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.setTextColor(16, 185, 129);
        doc.text(`Table ${tableIndex + 1} (continued)`, 14, startY - 3);
        doc.setTextColor(0, 0, 0);
      }

      const tableConfig = {
        head: [translatedHeaders],
        body: rows,
        startY,
        styles: {
          fontSize: 7,
          cellPadding: 2.5,
          overflow: "linebreak",
          cellWidth: "wrap",
          minCellHeight: 8,
          valign: "middle",
          halign: "left",
          lineColor: [229, 231, 235],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
          fontSize: 8,
          cellPadding: 3,
          minCellHeight: 10,
          overflow: "linebreak",
        },
        bodyStyles: {
          textColor: [31, 41, 55],
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        columnStyles,
        margin: { left: 10, right: 10, top: 10, bottom: 15 },
        theme: "grid",
        tableWidth: "auto",
        showHead: "everyPage",
        didDrawPage: (hookData) => {
          const pageCount = doc.internal.getNumberOfPages();
          const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
          doc.setFontSize(8);
          doc.setTextColor(107, 114, 128);
          doc.text(
            `Page ${currentPage} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 8,
            { align: "center" },
          );
        },
      };

      if (typeof doc.autoTable === "function") {
        doc.autoTable(tableConfig);
        startY = doc.lastAutoTable.finalY + 10;
      } else if (typeof autoTable === "function") {
        autoTable(doc, tableConfig);
        startY = doc.lastAutoTable.finalY + 10;
      }

      if (
        startY > doc.internal.pageSize.getHeight() - 40 &&
        tableIndex < tables.length - 1
      ) {
        doc.addPage();
        startY = 20;
      }
    });

    doc.save(filename);
  } catch (error) {
    const errorMessage = error?.message || "Unknown error";
    throw new Error(`PDF export failed: ${errorMessage}`);
  }
};
