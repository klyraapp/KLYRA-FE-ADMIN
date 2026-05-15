/**
 * User Management Page
 * Displays user list with search, filters, and add user functionality
 * Reuses UsersTable component from common
 */

import UsersTable from "@/components/common/UsersTable/UsersTable";
import { useDeleteUser, useUsers } from "@/hooks/useUsers";
import { formatDate, formatTime } from "@/utils/formatters";
import { Button, Modal } from "antd";
import { useCallback, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import styles from "../../../styles/UserManagement.module.css";

const UserManagementPage = () => {
  const [filters, setFilters] = useState({});

  const { data: usersData, isLoading } = useUsers();
  const users = usersData?.records || [];
  const { mutate: deleteUser } = useDeleteUser();

  const transformedUsers = useMemo(() => {
    return users.map((user, index) => ({
      key: user.id?.toString() || index.toString(),
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "-",
      role: user.roles?.[0]?.name || "User",
      avatar: `https://randomuser.me/api/portraits/${index % 2 === 0 ? "men" : "women"}/${(index % 10) + 1}.jpg`,
      userId: `U-${user.id || index}`,
      department: user.roles?.[0]?.name || "General",
      contactInfo: user.phone || "-",
      status: user.isActive !== false ? "active" : "inactive",
      date: formatDate(user.createdAt),
      time: typeof user.createdAt === "string" ? formatTime(user.createdAt.split("T")[1]?.substring(0, 8)) : "-",
      shift: "Day",
      email: user.email,
      originalData: user,
    }));
  }, [users]);

  const filteredUsers = useMemo(() => {
    let result = [...transformedUsers];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.contactInfo?.includes(term),
      );
    }

    if (filters.status) {
      result = result.filter((user) => user.status === filters.status);
    }

    return result;
  }, [transformedUsers, filters]);

  const handleAddUser = useCallback(() => {
    // TODO: Open add user modal
  }, []);

  const handleRowAction = useCallback(
    (action, record) => {
      if (action === "delete") {
        Modal.confirm({
          title: "Delete User",
          content: `Are you sure you want to delete ${record.name}?`,
          okText: "Delete",
          okType: "danger",
          onOk: () => deleteUser(record.originalData?.id),
        });
      } else if (action === "edit") {
        // TODO: Open edit modal
      } else if (action === "view") {
        // TODO: Open view modal
      }
    },
    [deleteUser],
  );

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>User Management</h1>
          <p className={styles.pageSubtitle}>
            View and manage all users in your organization
          </p>
        </div>
        <Button
          type="primary"
          className={styles.addUserButton}
          onClick={handleAddUser}
        >
          <FiPlus className={styles.addUserIcon} />
          Add User
        </Button>
      </div>

      <div className={styles.tableCard}>
        <UsersTable
          data={filteredUsers}
          onRowAction={handleRowAction}
          onFilterChange={handleFilterChange}
          showHeader={false}
          variant="standalone"
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default UserManagementPage;
