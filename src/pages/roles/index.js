/**
 * Roles Management Page
 * Displays roles table with CRUD operations.
 * Uses RBAC hooks for permission-based access control.
 */

import ActionMenu from "@/components/ActionMenu/ActionMenu";
import AntTable from "@/components/AntTable/AntTable";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import DetailModal from "@/components/common/DetailModal";
import PageHeader from "@/components/PageHeader/PageHeader";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import CreateRoleModal from "@/components/Roles/CreateRole";
import RolesTableTop from "@/components/Roles/RolesTableTop";
import PageGuard from "@/components/common/RBAC/PageGuard";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import ServiceLocationSelector from "@/components/common/ServiceLocationSelector";
import usePermission from "@/hooks/usePermission";
import useTableColumns from "@/hooks/useTableColumns";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import {
  useRolesList,
  usePermissionsList,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/hooks/useRoles";
import { useTranslation } from "@/hooks/useTranslation";
import { useSelector } from "react-redux";
import { selectIsSuperAdmin } from "@/redux/reducers/permissionSlice";
import { useCallback, useMemo, useState } from "react";
import styles from "@/styles/RoleManagement.module.css";

const RolesPage = () => {
  const { t } = useTranslation();
  const { can } = usePermission();
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const { getRolesColumns } = useTableColumns();

  const [locationFilter, setLocationFilter] = useState(null);
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
    open: false,
  });

  const rolesParams = useMemo(() => {
    const params = {};
    if (locationFilter && locationFilter !== "all") {
      params.serviceLocationId = locationFilter;
    }
    return params;
  }, [locationFilter]);

  const { data: roles = [], isLoading: rolesLoading } = useRolesList(rolesParams);

  const { data: permissionsData = [] } = usePermissionsList();

  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();

  const canUpdate = can(PERMISSION_KEYS.ROLE_UPDATE);
  const canDelete = can(PERMISSION_KEYS.ROLE_DELETE);

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data, open: true });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null, open: false });
  }, []);

  const handleOpenModal = useCallback(() => {
    openModal("create");
  }, [openModal]);

  const handleLocationChange = useCallback((value) => {
    setLocationFilter(value);
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

  const handleSubmitRole = useCallback(
    (payload) => {
      if (modalState.type === "edit" && modalState.data?.id) {
        updateRole(
          { id: modalState.data.id, data: payload },
          { onSuccess: () => closeModal() },
        );
      } else {
        createRole(payload, {
          onSuccess: () => closeModal(),
        });
      }
    },
    [modalState, updateRole, createRole, closeModal],
  );

  const handleConfirmDelete = useCallback(() => {
    if (modalState.data?.id) {
      deleteRole(modalState.data.id, {
        onSuccess: () => closeModal(),
      });
    }
  }, [modalState.data, deleteRole, closeModal]);

  const columns = useMemo(
    () => getRolesColumns(handleRowAction, styles, ActionMenu, canUpdate, canDelete),
    [handleRowAction, getRolesColumns, canUpdate, canDelete],
  );

  const roleViewFields = useMemo(
    () => [
      { name: "id", label: "ID" },
      { name: "name", label: t("pages.roles.roleName") },
      { name: "createdAt", label: t("pages.roles.createdAt"), type: "date" },
    ],
    [t],
  );

  return (
    <PageGuard permission={PERMISSION_KEYS.ROLE_READ}>
      <div className={styles.pageContainer}>
        <PageHeader
          title={t("pages.roles.title") || "Role Management"}
          subtitle={t("pages.roles.subtitle") || "Manage roles and their permissions"}
          actions={
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
              <RolesTableTop handleOpenModal={handleOpenModal} />
              {isSuperAdmin && (
                <ServiceLocationSelector
                  value={locationFilter}
                  onChange={handleLocationChange}
                  showAllOption
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
              dataSource={roles}
              rowKey="id"
              loading={rolesLoading}
            />
          </ErrorBoundary>
        </div>

        {modalState.open && modalState.type === "view" && (
          <DetailModal
            open={modalState.open}
            onClose={closeModal}
            title={t("pages.roles.roleName")}
            data={modalState.data}
            fields={roleViewFields}
            mode="view"
          />
        )}

        {modalState.open && (modalState.type === "create" || modalState.type === "edit") && (
          <CreateRoleModal
            open={modalState.open}
            onClose={closeModal}
            editData={modalState.data}
            permissionsData={permissionsData}
            onSubmit={handleSubmitRole}
            isSubmitting={isCreating || isUpdating}
          />
        )}

        <DeleteConfirmModal
          open={modalState.open && modalState.type === "delete"}
          onConfirm={handleConfirmDelete}
          onCancel={closeModal}
          title={t("pages.roles.deleteTitle") || "Delete Role"}
          itemName={modalState.data?.name}
          loading={isDeleting}
        />
      </div>
    </PageGuard>
  );
};

export default RolesPage;
