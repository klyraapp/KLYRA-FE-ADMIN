/**
 * FiltersBar Component
 * Reusable filters bar with search, status, and date filters
 */

import { useTranslation } from "@/hooks/useTranslation";
import { CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, Select } from "antd";
import PropTypes from "prop-types";
import { memo, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectIsSuperAdmin } from "@/redux/reducers/permissionSlice";
import ServiceLocationSelector from "../common/ServiceLocationSelector";
import styles from "./FiltersBar.module.css";

const FiltersBar = ({
  searchPlaceholder,
  onSearch,
  onStatusChange,
  onDateChange,
  showDateFilter,
  showStatusFilter,
  showSearch = true,
  statusOptions,
  dateValue,
  statusValue,
  searchValue,
  onLocationChange,
  showLocationFilter = true,
  locationValue,
  children,
}) => {
  const { t } = useTranslation();

  const DEFAULT_STATUS_OPTIONS = useMemo(
    () => [
      { value: "all", label: t("filters.statusAll") },
      { value: "active", label: t("filters.statusActive") },
      { value: "inactive", label: t("filters.statusInactive") },
    ],
    [t],
  );

  const activeStatusOptions = statusOptions || DEFAULT_STATUS_OPTIONS;

  const handleSearch = useCallback(
    (e) => {
      if (onSearch) {
        onSearch(e.target.value);
      }
    },
    [onSearch],
  );

  const handleStatusChange = useCallback(
    (value) => {
      if (onStatusChange) {
        onStatusChange(value);
      }
    },
    [onStatusChange],
  );

  const handleDateChange = useCallback(
    (date, dateString) => {
      if (onDateChange) {
        onDateChange(date, dateString);
      }
    },
    [onDateChange],
  );

  const handleLocationChange = useCallback(
    (value) => {
      if (onLocationChange) {
        onLocationChange(value);
      }
    },
    [onLocationChange],
  );

  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  return (
    <div className={styles.filtersBar}>
      {showSearch && (
        <div className={styles.searchWrapper}>
          <Input
            placeholder={searchPlaceholder || t("filters.searchPlaceholder")}
            prefix={<SearchOutlined className={styles.searchIcon} />}
            onChange={handleSearch}
            value={searchValue}
            className={styles.searchInput}
          />
        </div>
      )}
      <div className={styles.filtersRight}>
        {showStatusFilter && (
          <Select
            value={statusValue || "all"}
            options={activeStatusOptions}
            onChange={handleStatusChange}
            className={styles.statusSelect}
            style={{ width: 140 }}
          />
        )}
        {showDateFilter && (
          <DatePicker
            picker="month"
            placeholder={t("filters.selectMonth")}
            onChange={handleDateChange}
            value={dateValue}
            suffixIcon={<CalendarOutlined />}
            className={styles.datePicker}
          />
        )}
        {isSuperAdmin && showLocationFilter && (
          <ServiceLocationSelector
            value={locationValue}
            onChange={handleLocationChange}
            style={{ width: 180 }}
          />
        )}
        {children}
      </div>
    </div>
  );
};

FiltersBar.propTypes = {
  searchPlaceholder: PropTypes.string,
  onSearch: PropTypes.func,
  onStatusChange: PropTypes.func,
  onDateChange: PropTypes.func,
  showDateFilter: PropTypes.bool,
  showStatusFilter: PropTypes.bool,
  showSearch: PropTypes.bool,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  children: PropTypes.node,
  dateValue: PropTypes.object,
  statusValue: PropTypes.string,
  searchValue: PropTypes.string,
};

FiltersBar.defaultProps = {
  searchPlaceholder: "",
  onSearch: null,
  onStatusChange: null,
  onDateChange: null,
  showDateFilter: true,
  showStatusFilter: true,
  showSearch: true,
  statusOptions: null,
  children: null,
  dateValue: null,
  statusValue: "",
  searchValue: "",
  onLocationChange: null,
  showLocationFilter: true,
  locationValue: null,
};

export default memo(FiltersBar);
