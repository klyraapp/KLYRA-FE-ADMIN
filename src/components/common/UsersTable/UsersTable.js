/**
 * UsersTable Component
 * Displays a table of users with status and actions
 */

import { Avatar, Dropdown, Table, Tag } from "antd";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import { FiMoreVertical } from "react-icons/fi";






const STATUS_CONFIG = {
  active: { color: "green", label: "Active" },
  inactive: { color: "red", label: "Inactive" },
};

const ACTION_ITEMS = [
  { key: "view", label: "View Details" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

const UsersTable = ({
  data,
  onRowAction,
  onFilterChange,
  showHeader,
  variant,
  loading,
}) => {
  const handleMenuClick =
    (record) =>
    ({ key }) => {
      if (onRowAction) {
        onRowAction(key, record);
      }
    };

  const columns = useMemo(
    () => [
      {
        title: "User",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar src={record.avatar} size={40} />
            <div>
              <div style={{ fontWeight: 500 }}>{text}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                {record.role}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "User ID",
        dataIndex: "userId",
        key: "userId",
      },
      {
        title: "Department",
        dataIndex: "department",
        key: "department",
      },
      {
        title: "Contact",
        dataIndex: "contactInfo",
        key: "contactInfo",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const config = STATUS_CONFIG[status] || STATUS_CONFIG.inactive;
          return <Tag color={config.color}>{config.label}</Tag>;
        },
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (date, record) => (
          <div>
            <div>{date}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{record.time}</div>
          </div>
        ),
      },
      {
        title: "Shift",
        dataIndex: "shift",
        key: "shift",
      },
      {
        title: "",
        key: "actions",
        width: 50,
        render: (_, record) => (
          <Dropdown
            menu={{ items: ACTION_ITEMS, onClick: handleMenuClick(record) }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              type="button"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 8,
              }}
            >
              <FiMoreVertical size={18} color="#6b7280" />
            </button>
          </Dropdown>
        ),
      },
    ],
    [onRowAction],
  );

  return (
    <ErrorBoundary>
      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        pagination={{ pageSize: 10 }}
        rowKey="key"
        showHeader={showHeader !== false}
        loading={loading}
      />
    </ErrorBoundary>
  );
};

UsersTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string,
      avatar: PropTypes.string,
      userId: PropTypes.string,
      department: PropTypes.string,
      contactInfo: PropTypes.string,
      status: PropTypes.oneOf(["active", "inactive"]),
      date: PropTypes.string,
      time: PropTypes.string,
      shift: PropTypes.string,
    }),
  ),
  onRowAction: PropTypes.func,
  onFilterChange: PropTypes.func,
  showHeader: PropTypes.bool,
  variant: PropTypes.string,
  loading: PropTypes.bool,
};

UsersTable.defaultProps = {
  data: [],
  onRowAction: null,
  onFilterChange: null,
  showHeader: true,
  variant: "default",
  loading: false,
};

export default memo(UsersTable);
