/**
 * ServiceLocationSelector Component
 * Reusable dropdown for selecting service locations.
 */

import { useServiceLocations } from "@/hooks/useServiceLocations";
import { useTranslation } from "@/hooks/useTranslation";
import { Select } from "antd";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";

const ServiceLocationSelector = ({
  value,
  onChange,
  placeholder,
  className,
  style,
  allowClear = true,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const { locations, isLoading } = useServiceLocations();

  const options = useMemo(() => {
    return locations.map((loc) => ({
      value: loc.id,
      label: loc.name,
    }));
  }, [locations]);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder || t("common.selectLocation") || "Select Location"}
      options={options}
      loading={isLoading}
      disabled={disabled}
      allowClear={allowClear}
      className={className}
      style={style}
    />
  );
};

ServiceLocationSelector.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default memo(ServiceLocationSelector);
