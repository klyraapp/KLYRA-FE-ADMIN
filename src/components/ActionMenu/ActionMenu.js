/**
 * ActionMenu Component
 * Reusable dropdown action menu with translation support
 */

import { useTranslation } from "@/hooks/useTranslation";
import { MoreOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import PropTypes from "prop-types";
import { memo, useCallback, useMemo } from "react";
import styles from "./ActionMenu.module.css";

const ActionMenu = ({ items, onAction, record }) => {
  const { t } = useTranslation();

  const defaultItems = useMemo(
    () => [
      { key: "view", label: t("actions.view_details") },
      { key: "edit", label: t("actions.edit") },
      { key: "delete", label: t("actions.delete") },
    ],
    [t],
  );

  const handleClick = useCallback(
    ({ key }) => {
      if (onAction) {
        onAction(key, record);
      }
    },
    [onAction, record],
  );

  const menuItems = items || defaultItems;

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleClick }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <button type="button" className={styles.actionButton}>
        <MoreOutlined className={styles.actionIcon} />
      </button>
    </Dropdown>
  );
};

ActionMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  onAction: PropTypes.func,
  record: PropTypes.object,
};

ActionMenu.defaultProps = {
  items: null,
  onAction: null,
  record: null,
};

export default memo(ActionMenu);
