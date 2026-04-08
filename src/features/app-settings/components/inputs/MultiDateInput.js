import { useTranslation } from "@/hooks/useTranslation";
import { DatePicker, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import styles from "./Inputs.module.css";

/**
 * MultiDateInput component for selecting multiple dates in a compact tag-based layout
 * @param {Object} props
 * @param {string[]} props.value - Array of ISO date strings
 * @param {Function} props.onChange - Callback with updated array
 */
const MultiDateInput = ({ value = [], onChange }) => {
  const { t } = useTranslation();

  const handleAddDate = (date) => {
    if (!date) return;
    const dateStr = date.format('YYYY-MM-DD');
    if (!value.includes(dateStr)) {
      onChange([...value, dateStr]);
    }
  };

  const handleRemoveDate = (removedDate) => {
    const newValue = value.filter(date => date !== removedDate);
    onChange(newValue);
  };

  const disabledDate = (current) => {
    if (!current) return false;
    return value.some(date => dayjs(date).isSame(current, 'day'));
  };

  const cellRender = (current, info) => {
    if (info.type !== 'date') return info.originNode;
    const isSelected = value.some(date => dayjs(date).isSame(current, 'day'));
    if (isSelected) {
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
      {value.length > 0 && (
        <div className={styles.tagContainer}>
          {value.map((dateStr) => (
            <Tag
              key={dateStr}
              closable
              onClose={() => handleRemoveDate(dateStr)}
              style={{ margin: "2px 0" }}
            >
              {dayjs(dateStr).format("YYYY-MM-DD")}
            </Tag>
          ))}
        </div>
      )}
      <div className={styles.addItemRow}>
        <DatePicker
          placeholder={t("settings.selectDate") || "Select date"}
          onChange={handleAddDate}
          disabledDate={disabledDate}
          cellRender={cellRender}
          value={null}
          style={{ width: '100%' }}
          size="small"
        />
      </div>
    </div>
  );
};

export default MultiDateInput;
