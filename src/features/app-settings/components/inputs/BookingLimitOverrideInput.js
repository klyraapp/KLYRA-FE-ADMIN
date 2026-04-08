import { useTranslation } from "@/hooks/useTranslation";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, InputNumber, Tooltip } from "antd";
import dayjs from "dayjs";
import styles from "./Inputs.module.css";

/**
 * BookingLimitOverrideInput component for managing date-specific booking limits 
 * Improved layout for alignment with form themes
 * @param {Object} props
 * @param {Array} props.value - Array of { date, limit }
 * @param {Function} props.onChange - Callback with updated array
 */
const BookingLimitOverrideInput = ({ value = [], onChange }) => {
  const { t } = useTranslation();

  const handleAdd = () => {
    onChange([...value, { date: "", limit: 1 }]);
  };

  const handleChange = (index, field, val) => {
    const newValue = [...value];
    if (field === 'date') {
      newValue[index][field] = val ? val.format('YYYY-MM-DD') : "";
    } else {
      newValue[index][field] = val;
    }
    onChange(newValue);
  };

  const handleRemove = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const disabledDate = (current, currentIndex) => {
    if (!current) return false;
    return value.some((item, index) =>
      index !== currentIndex && item.date && dayjs(item.date).isSame(current, 'day')
    );
  };

  const cellRender = (current, info, currentIndex) => {
    if (info.type !== 'date') return info.originNode;
    const isOtherSelected = value.some((item, index) =>
      index !== currentIndex && item.date && dayjs(item.date).isSame(current, 'day')
    );
    if (isOtherSelected) {
      return (
        <Tooltip title={t("settings.alreadySelected") || "Already selected"}>
          <div className="ant-picker-cell-inner ant-picker-cell-inner-disabled">
            {current.date()}
          </div>
        </Tooltip>
      );
    }
    return info.originNode;
  };

  return (
    <div className={styles.multiInputContainer}>
      <div className={styles.overrideList}>
        {value.map((item, index) => (
          <div key={index} className={styles.overrideRow}>
            <DatePicker
              value={item.date ? dayjs(item.date) : null}
              onChange={(date) => handleChange(index, 'date', date)}
              disabledDate={(current) => disabledDate(current, index)}
              cellRender={(current, info) => cellRender(current, info, index)}
              placeholder={t("settings.selectDate") || "Date"}
              style={{ flex: 2 }}
              size="small"
            />
            <InputNumber
              min={1}
              value={item.limit}
              onChange={(val) => handleChange(index, 'limit', val)}
              placeholder={t("settings.limit") || "Limit"}
              style={{ flex: 1 }}
              size="small"
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemove(index)}
              size="small"
            />
          </div>
        ))}
      </div>
      <Button
        type="dashed"
        onClick={handleAdd}
        icon={<PlusOutlined />}
        size="small"
        style={{ marginTop: 4, width: 'auto', minWidth: '120px' }}
      >
        {t("settings.addOverride") || "Add Override"}
      </Button>
    </div>
  );
};

export default BookingLimitOverrideInput;
