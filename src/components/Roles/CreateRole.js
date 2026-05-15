/**
 * CreateRole Modal Component
 * Creates or edits a role with grouped permissions UI.
 * Uses shared DetailModal for consistency.
 */

import DetailModal from "../common/DetailModal";
import { groupPermissionsByResource } from "@/utils/groupPermissions";
import { useTranslation } from "@/hooks/useTranslation";
import { Checkbox } from "antd";
import { useMemo, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { memo } from "react";
import { useSelector } from "react-redux";
import { selectIsSuperAdmin } from "@/redux/reducers/permissionSlice";
import ServiceLocationSelector from "../common/ServiceLocationSelector";
import LocationName from "../common/LocationName";
import styles from "@/styles/RoleManagement.module.css";

const PermissionGroup = memo(({
  group,
  selectedIds,
  onToggle,
  onToggleGroup,
}) => {
  const viewPermission = group.permissions.find(
    (p) => p.action === "read" || p.action === "read_all"
  );

  const isViewSelected = viewPermission ? selectedIds.includes(viewPermission.id) : false;

  const allSelected = group.permissions.every((p) =>
    selectedIds.includes(p.id),
  );

  const someSelected = group.permissions.some((p) =>
    selectedIds.includes(p.id),
  );

  const handleChildToggle = (permId, checked, action) => {
    // If we're toggling view off, we should ideally deselect others too
    // But the parent handleTogglePermission will handle the logic if we pass it correctly
    // or we can handle it here and call onToggle multiple times
    onToggle(permId, checked, group, action);
  };

  return (
    <div className={styles.permissionGroup}>
      <div className={styles.permissionGroupHeader}>
        <Checkbox
          checked={allSelected}
          indeterminate={!allSelected && someSelected}
          onChange={(e) => onToggleGroup(group, e.target.checked)}
        >
          <span className={styles.permissionGroupTitle}>
            {group.label}
          </span>
        </Checkbox>
      </div>
      <div className={styles.permissionGroupItems}>
        {group.permissions.map((perm) => {
          const isViewAction = perm.action === "read" || perm.action === "read_all";
          const isDisabled = !isViewAction && !isViewSelected;

          return (
            <Checkbox
              key={perm.id}
              checked={selectedIds.includes(perm.id)}
              disabled={isDisabled}
              onChange={(e) => handleChildToggle(perm.id, e.target.checked, perm.action)}
            >
              {perm.actionLabel}
            </Checkbox>
          );
        })}
      </div>
    </div>
  );
});

PermissionGroup.displayName = "PermissionGroup";

const CreateRoleModal = ({
  open,
  onClose,
  editData,
  permissionsData,
  onSubmit,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const isEditMode = Boolean(editData?.id);

  const groupedPermissions = useMemo(
    () => groupPermissionsByResource(permissionsData || []),
    [permissionsData],
  );

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        const rolePermissions = (editData?.rolePermission || []).map(
          (item) => item?.permissionId,
        );
        setSelectedPermissions(rolePermissions);
      } else {
        setSelectedPermissions([]);
      }
    }
  }, [open, isEditMode, editData]);

  const handleTogglePermission = useCallback((permId, checked, group, action) => {
    setSelectedPermissions((prev) => {
      const isViewAction = action === "read" || action === "read_all";

      if (!checked) {
        let newSelection = prev.filter((id) => id !== permId);

        // If unselecting View, also unselect all CRUD in this group
        if (isViewAction) {
          const groupPermIds = group.permissions.map(p => p.id);
          newSelection = newSelection.filter(id => !groupPermIds.includes(id));
        }

        return newSelection;
      }

      return [...prev, permId];
    });
  }, []);

  const handleToggleGroup = useCallback((group, checked) => {
    const groupIds = group.permissions.map((p) => p.id);
    setSelectedPermissions((prev) => {
      if (checked) {
        const newIds = groupIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      }
      // Uncheck all in group
      return prev.filter((id) => !groupIds.includes(id));
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked) => {
      if (checked) {
        const allIds = (permissionsData || []).map((p) => p.id);
        setSelectedPermissions(allIds);
      } else {
        setSelectedPermissions([]);
      }
    },
    [permissionsData],
  );

  const allSelected = useMemo(() => {
    if (!permissionsData?.length) return false;
    return permissionsData.length === selectedPermissions.length;
  }, [permissionsData, selectedPermissions]);

  const someSelected = selectedPermissions.length > 0 && !allSelected;

  const handleSave = useCallback(
    (values) => {
      const finalPermissions = selectedPermissions;

      const payload = {
        name: values.name,
        serviceLocationId: values.serviceLocationId,
      };

      if (isEditMode) {
        const previousIds = (editData?.rolePermission || []).map(
          (item) => item?.permissionId,
        );
        payload.newPermissions = finalPermissions.filter(
          (id) => !previousIds.includes(id),
        );
        payload.deletePermissions = previousIds.filter(
          (id) => !finalPermissions.includes(id),
        );
      } else {
        payload.permissions = finalPermissions;
      }

      onSubmit(payload);
    },
    [isEditMode, editData, selectedPermissions, onSubmit, permissionsData],
  );

  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  const fields = useMemo(() => {
    const baseFields = [
      {
        name: "name",
        label: t("pages.roles.roleName") || "Role Name",
        placeholder: t("pages.roles.roleNamePlaceholder") || "Enter role name",
        rules: [{ required: true, message: t("pages.roles.roleNameRequired") || "Required" }],
        fullWidth: true,
      },
    ];

    if (isSuperAdmin) {
      baseFields.push({
        name: "serviceLocationId",
        label: t("common.location") || "Location",
        type: "custom",
        component: (props) => <ServiceLocationSelector {...props} />,
        render: (val) => <LocationName id={val} />,
        rules: [{ required: true, message: t("common.locationRequired") || "Required" }],
        fullWidth: true,
      });
    }

    return baseFields;
  }, [t, isSuperAdmin]);

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={t("modals.role") || "Role"}
      data={editData}
      fields={fields}
      mode={isEditMode ? "edit" : "edit"}
      isCreateMode={!isEditMode}
      loading={isSubmitting}
    >
      <div className={styles.permissionsSection}>
        <div className={styles.permissionsSectionHeader}>
          <h4 className={styles.permissionsSectionTitle}>
            {t("pages.roles.permissions") || "Permissions"}
          </h4>
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            {t("common.selectAll") || "Select All"}
          </Checkbox>
        </div>

        <div className={styles.permissionGroups}>
          {groupedPermissions.map((group) => (
            <PermissionGroup
              key={group.resource}
              group={group}
              selectedIds={selectedPermissions}
              onToggle={handleTogglePermission}
              onToggleGroup={handleToggleGroup}
            />
          ))}
        </div>
      </div>
    </DetailModal>
  );
};

CreateRoleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.object,
  permissionsData: PropTypes.arrayOf(PropTypes.object),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default memo(CreateRoleModal);

