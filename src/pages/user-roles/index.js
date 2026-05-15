/**
 * User Roles Management Page
 * Displays user list with role assignments and edit role modal.
 * Uses RBAC hooks for permission-based access control.
 */

import ActionMenu from "@/components/ActionMenu/ActionMenu";
import AntTable from "@/components/AntTable/AntTable";
import PageHeader from "@/components/PageHeader/PageHeader";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import PageGuard from "@/components/common/RBAC/PageGuard";
import DetailModal from "@/components/common/DetailModal";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import UserRoleModal from "@/components/Roles/UserRoleModal";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import useUserRoles from "@/hooks/useUserRoles";
import usePermission from "@/hooks/usePermission";
import useTableColumns from "@/hooks/useTableColumns";
import { useTranslation } from "@/hooks/useTranslation";
import { Tag } from "antd";
import { useCallback, useMemo, useState } from "react";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import ServiceLocationSelector from "@/components/common/ServiceLocationSelector";
import { useSelector } from "react-redux";
import { selectIsSuperAdmin } from "@/redux/reducers/permissionSlice";
import styles from "@/styles/RoleManagement.module.css";

const UserRolesPage = () => {
  const { t } = useTranslation();
  const { can } = usePermission();
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const { getUserRolesColumns } = useTableColumns();
  
  const [locationFilter, setLocationFilter] = useState(null);
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
    open: false,
  });

  const userParams = useMemo(() => {
    const params = {};
    if (locationFilter && locationFilter !== "all") {
      params.serviceLocationId = locationFilter;
    }
    return params;
  }, [locationFilter]);

  const {
    users,
    isLoadingUsers,
    roles,
    createAdmin,
    isCreating,
    updateAdmin,
    isUpdating,
    deleteAdmin,
    isDeleting,
  } = useUserRoles(userParams);

  const handleLocationChange = useCallback((value) => {
    setLocationFilter(value);
  }, []);

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data, open: true });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null, open: false });
  }, []);

  const handleRowAction = useCallback(
    (action, record) => {
      if (action === "view") {
        openModal("view", record);
      } else if (action === "edit") {
        openModal("edit", record);
      } else if (action === "delete") {
        openModal("delete", record);
      }
    },
    [openModal],
  );

  const handleSubmitUser = useCallback(
    (userId, payload) => {
      if (modalState.type === "edit" && userId) {
        updateAdmin(
          { userId, data: payload },
          { onSuccess: () => closeModal() },
        );
      } else {
        createAdmin(payload, {
          onSuccess: () => closeModal(),
        });
      }
    },
    [modalState.type, createAdmin, updateAdmin, closeModal],
  );

  const handleConfirmDelete = useCallback(() => {
    if (modalState.data?.id) {
      deleteAdmin(modalState.data.id, {
        onSuccess: () => closeModal(),
      });
    }
  }, [modalState.data, deleteAdmin, closeModal]);

  const userViewFields = useMemo(
    () => [
      { name: "id", label: "ID" },
      { name: "firstName", label: t("pages.userRoles.firstName") || "First Name" },
      { name: "lastName", label: t("pages.userRoles.lastName") || "Last Name" },
      { name: "email", label: t("pages.userRoles.email") || "Email" },
      {
        name: "roles",
        label: t("pages.userRoles.roles") || "Roles",
        render: (roles) => (roles || []).map((r) => r.name).join(", "),
      },
      { name: "createdAt", label: t("table.createdAt") || "Created At", type: "date" },
    ],
    [t],
  );

  const columns = useMemo(
    () =>
      getUserRolesColumns(
        handleRowAction,
        styles,
        ActionMenu,
        Tag,
        can(PERMISSION_KEYS.USER_UPDATE),
        can(PERMISSION_KEYS.USER_DELETE),
      ),
    [handleRowAction, getUserRolesColumns, can],
  );

  return (
    <PageGuard permission={PERMISSION_KEYS.USER_READ}>
      <div className={styles.pageContainer}>
        <PageHeader
          title={t("pages.userRoles.title") || "User Role Assignment"}
          subtitle={t("pages.userRoles.subtitle") || "Assign and manage roles for users"}
          actions={
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
              {can(PERMISSION_KEYS.USER_CREATE) && (
                <PrimaryButton onClick={() => openModal("create")}>
                  {t("pages.userRoles.addUser") || "Add User"}
                </PrimaryButton>
              )}
              {isSuperAdmin && (
                <ServiceLocationSelector
                  value={locationFilter}
                  onChange={handleLocationChange}
                  style={{ width: 180 }}
                />
              )}
            </div>
          }
        />

        <div className={styles.tableCard}>
          <ErrorBoundary>
            <AntTable
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={isLoadingUsers}
            />
          </ErrorBoundary>
        </div>

        {modalState.open && modalState.type === "view" && (
          <DetailModal
            open={modalState.open}
            onClose={closeModal}
            title={t("pages.userRoles.userDetails") || "User Details"}
            data={modalState.data}
            fields={userViewFields}
            mode="view"
          />
        )}

        {modalState.open && (modalState.type === "edit" || modalState.type === "create") && (
          <UserRoleModal
            open={modalState.open}
            onClose={closeModal}
            user={modalState.type === "edit" ? modalState.data : null}
            roles={roles}
            onSubmit={handleSubmitUser}
            isSubmitting={isCreating || isUpdating}
          />
        )}

        <DeleteConfirmModal
          open={modalState.open && modalState.type === "delete"}
          onConfirm={handleConfirmDelete}
          onCancel={closeModal}
          title={t("pages.userRoles.deleteTitle") || "Delete User"}
          itemName={
            modalState.data
              ? `${modalState.data.firstName} ${modalState.data.lastName}`
              : ""
          }
          loading={isDeleting}
        />
      </div>
    </PageGuard>
  );
};


export default UserRolesPage;
