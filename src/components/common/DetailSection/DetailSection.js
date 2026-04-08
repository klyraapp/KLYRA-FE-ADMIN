/**
 * DetailSection Component
 * Highly reusable component for displaying structured data sections
 * Supports multiple sections, nested objects, custom rendering, and flexible layouts
 */

import PropTypes from "prop-types";
import { memo } from "react";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import { safeMap } from "@/utils/safeRendering";
import styles from "./DetailSection.module.css";

const DetailSection = ({ sections }) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  const renderCellValue = (value, column, row) => {
    if (column.render) {
      return column.render(value, row);
    }

    if (value === null || value === undefined) {
      return "-";
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
      const entries = Object.entries(value);
      return (
        <div className={styles.nestedObject}>
          {safeMap(entries, ([key, val]) => (
            <div key={key} className={styles.nestedRow}>
              <span className={styles.nestedKey}>{key}:</span>
              <span className={styles.nestedValue}>
                {val === null || val === undefined
                  ? "null"
                  : JSON.stringify(val)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return String(value);
  };

  return (
    <div className={styles.container}>
      <ErrorBoundary>
        {safeMap(sections, (section, sectionIndex) => {
          const hasData = section?.data && section?.data.length > 0;

          if (!hasData && !section?.showEmpty) {
            return null;
          }

          return (
            <div
              key={section?.key || sectionIndex}
              className={styles.section}
              style={
                sectionIndex === 0
                  ? { marginTop: 0, paddingTop: 0, borderTop: "none" }
                  : {}
              }
            >
              <h4 className={styles.title}>{section?.title}</h4>

              {!hasData ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyText}>
                    {section?.emptyMessage || "No data available"}
                  </span>
                </div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {safeMap(section?.columns, (column) => (
                          <th
                            key={column?.key}
                            style={column?.width ? { width: column.width } : {}}
                          >
                            {column?.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {safeMap(section?.data, (row, rowIndex) => (
                        <tr key={row?.id || rowIndex}>
                          {safeMap(section?.columns, (column) => (
                            <td key={column?.key}>
                              {renderCellValue(
                                row[column?.dataIndex],
                                column,
                                row,
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </ErrorBoundary>
    </div>
  );
};

DetailSection.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.object),
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          dataIndex: PropTypes.string.isRequired,
          render: PropTypes.func,
          width: PropTypes.string,
        }),
      ).isRequired,
      emptyMessage: PropTypes.string,
      showEmpty: PropTypes.bool,
    }),
  ).isRequired,
};

export default memo(DetailSection);
