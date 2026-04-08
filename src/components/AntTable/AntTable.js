/**
 * AntTable Component
 * Reusable Ant Design table wrapper for consistent styling
 */

import { useTranslation } from "@/hooks/useTranslation";
import { Select, Table } from "antd";
import PropTypes from "prop-types";
import { memo, useCallback, useMemo } from "react";
import ErrorBoundary from "../common/ErrorBoundary/ErrorBoundary";
import styles from "./AntTable.module.css";

const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const AntTable = ({
  columns,
  dataSource,
  rowKey,
  loading,
  pagination,
  showPagination,
  defaultPageSize,
  onChange,
  onRow,
  rowClassName,
}) => {
  const { t } = useTranslation();

  const handleTableChange = useCallback(
    (paginationConfig, filters, sorter) => {
      if (onChange) {
        onChange(paginationConfig, filters, sorter);
      }
    },
    [onChange],
  );

  const paginationConfig = useMemo(() => {
    if (!showPagination) {
      return false;
    }

    const defaultConfig = {
      pageSize: defaultPageSize,
      showSizeChanger: true,
      showTotal: (total, range) =>
        `${range[0]}-${range[1]} ${t("common.of") || "of"} ${total} ${t("common.items") || "items"}`,
      position: ["bottomLeft"],
      pageSizeOptions: PAGE_SIZE_OPTIONS.map((opt) => opt.value),
    };

    return {
      ...defaultConfig,
      ...pagination,
    };
  }, [showPagination, defaultPageSize, pagination, t]);

  const currentPageSize = paginationConfig
    ? paginationConfig.pageSize || defaultPageSize
    : defaultPageSize;

  return (
    <div className={styles.tableWrapper}>
      <ErrorBoundary>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={rowKey}
          loading={loading}
          pagination={paginationConfig}
          onChange={handleTableChange}
          scroll={{ x: "max-content" }}
          onRow={onRow}
          rowClassName={rowClassName}
        />
      </ErrorBoundary>
      {showPagination && (
        <div className={styles.paginationWrapper}>
          <div />
          <div className={styles.pageSizeWrapper}>
            <span className={styles.pageSizeLabel}>{t("resultPerPage")}</span>
            <Select
              value={currentPageSize}
              onChange={(size) => {
                if (onChange) {
                  onChange(
                    {
                      current: 1,
                      pageSize: size,
                      total: paginationConfig.total,
                    },
                    {},
                    {},
                  );
                }
              }}
              options={PAGE_SIZE_OPTIONS}
              style={{ width: 70 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

AntTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.object),
  rowKey: PropTypes.string,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  showPagination: PropTypes.bool,
  defaultPageSize: PropTypes.number,
  onChange: PropTypes.func,
  onRow: PropTypes.func,
  rowClassName: PropTypes.func,
};

AntTable.defaultProps = {
  dataSource: [],
  rowKey: "id",
  loading: false,
  pagination: {},
  showPagination: true,
  defaultPageSize: 10,
  onChange: null,
  onRow: null,
  rowClassName: null,
};

export default memo(AntTable);
