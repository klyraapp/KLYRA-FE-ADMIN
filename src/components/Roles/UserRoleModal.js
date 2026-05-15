/**
 * UserRoleModal Component
 * Modal for assigning roles and optional direct permissions to a user.
 * Supports single role selection and delta-based permission overriding.
 * Prevents unchecking existing permissions (Role defaults + existing overrides).
 */

import DetailModal from "../common/DetailModal";
import { groupPermissionsByResource } from "@/utils/groupPermissions";
import { useTranslation } from "@/hooks/useTranslation";
import { usePermissionsList, useRolePermissions } from "@/hooks/useRoles";
import { Checkbox } from "antd";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsSuperAdmin } from "@/redux/reducers/permissionSlice";
import ServiceLocationSelector from "../common/ServiceLocationSelector";
import styles from "@/styles/RoleManagement.module.css";

const UserRoleModal = ({
  open,
  onClose,
  user,
  roles,
  onSubmit,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [showDirectPermissions, setShowDirectPermissions] = useState(false);
  const [baseRolePermIds, setBaseRolePermIds] = useState([]);
  const [lockedPermissionIds, setLockedPermissionIds] = useState([]);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  // Fetch all permissions for the list
  const { data: allPermissions = [] } = usePermissionsList({
    enabled: open && showDirectPermissions,
  });

  // Fetch default permissions for the selected role
  const { data: rolePermissions = [], isSuccess: isRolePermissionsLoaded } = useRolePermissions(selectedRoleId, {
    enabled: open && !!selectedRoleId,
  });

  const groupedPermissions = useMemo(
    () => groupPermissionsByResource(allPermissions),
    [allPermissions],
  );

  const roleOptions = useMemo(
    () =>
      (roles || []).map((role) => ({
        label: role.name,
        value: role.id,
      })),
    [roles],
  );

  // Initialize state from existing user data
  useEffect(() => {
    if (open) {
      if (user && Array.isArray(user.userRolePermission)) {
        const roleEntry = user.userRolePermission.find(urp => urp.roleId && urp.role);
        const currentRoleId = roleEntry ? roleEntry.roleId : null;

        const rolePermIds = roleEntry?.role?.rolePermission
          ? roleEntry.role.rolePermission.map(rp => rp.permissionId)
          : [];

        const directPermIds = user.userRolePermission
          .filter(urp => !urp.roleId && urp.permissionId)
          .map(urp => urp.permissionId);

        const combinedIds = Array.from(new Set([...rolePermIds, ...directPermIds]));

        setSelectedRoleId(currentRoleId);
        setSelectedPermissionIds(combinedIds);
        setBaseRolePermIds(rolePermIds);
        // On load, everything that is checked is "locked" (cannot be unchecked)
        setLockedPermissionIds(combinedIds);
        setShowDirectPermissions(directPermIds.length > 0);
      } else {
        setSelectedRoleId(null);
        setSelectedPermissionIds([]);
        setBaseRolePermIds([]);
        setLockedPermissionIds([]);
        setShowDirectPermissions(false);
      }
    }
  }, [open, user]);

  // Handle role change and fetch role permissions
  useEffect(() => {
    if (open && isRolePermissionsLoaded && rolePermissions.length > 0) {
      const pIds = rolePermissions.map(rp => rp.permissionId || rp.id);
      setBaseRolePermIds(pIds);

      const originalRoleId = user?.userRolePermission?.find(urp => urp.role)?.roleId;

      // If the role has changed, update the selections and lock the new role's permissions
      if (selectedRoleId !== originalRoleId || !user) {
        setSelectedPermissionIds(pIds);
        setLockedPermissionIds(pIds);
      }
    } else if (open && isRolePermissionsLoaded && rolePermissions.length === 0 && selectedRoleId) {
      // Handle the case where a role might have 0 permissions
      setBaseRolePermIds([]);
      const originalRoleId = user?.userRolePermission?.find(urp => urp.role)?.roleId;
      if (selectedRoleId !== originalRoleId || !user) {
        setSelectedPermissionIds([]);
        setLockedPermissionIds([]);
      }
    }
  }, [isRolePermissionsLoaded, rolePermissions, selectedRoleId, user, open]);

  const handleTogglePermission = useCallback((permId, checked) => {
    // Logic: User can ONLY check unchecked boxes. They cannot uncheck locked boxes.
    setSelectedPermissionIds((prev) =>
      checked
        ? Array.from(new Set([...prev, permId]))
        : prev.filter((id) => id !== permId)
    );
  }, []);

  const handleSave = useCallback(
    (values) => {
      if (!user) {
        // Create User - Keep original flow and payload independent
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
          // serviceLocationId: values.serviceLocationId,
          roles: values.roles ? [values.roles] : [],
          permissions: selectedPermissionIds,
          userSettings: { isTwoFactorAuth: false },
        };
        onSubmit(null, payload);
        return;
      }

      // Update User - Implement the specific PUT payload structure
      const currentRoleId = values.roles;
      const previousRoles = user.userRolePermission
        ? user.userRolePermission
          .filter((urp) => urp.roleId)
          .map((urp) => urp.roleId)
        : [];
      const currentRoles = currentRoleId ? [currentRoleId] : [];

      // Calculate Direct Permissions (Overrides)
      // Any permission in selectedPermissionIds that is not provided by the base role is a direct permission
      const previousDirectPermissions = user.userRolePermission
        ? user.userRolePermission
          .filter((urp) => !urp.roleId && urp.permissionId)
          .map((urp) => urp.permissionId)
        : [];

      const currentDirectPermissions = selectedPermissionIds.filter(
        (id) => !baseRolePermIds.includes(id),
      );

      const payload = {
        email: values.email,
        phone: values.phone || "",
        firstName: values.firstName,
        lastName: values.lastName,
        // serviceLocationId: values.serviceLocationId,
        fcmToken: user.fcmToken || "",
        languagePreference: user.languagePreference || "en",
        newRoles: currentRoles.filter((id) => !previousRoles.includes(id)),
        deleteRoles: previousRoles.filter((id) => !currentRoles.includes(id)),
        newPermissions: currentDirectPermissions.filter(
          (id) => !previousDirectPermissions.includes(id),
        ),
        deletePermissions: previousDirectPermissions.filter(
          (id) => !currentDirectPermissions.includes(id),
        ),
        userSettings: {
          isTwoFactorAuth:
            user.userSettings?.isTwoFactorAuth ||
            user.isTwoFactorAuth ||
            false,
        },
      };

      if (values.password) {
        payload.password = values.password;
      }

      onSubmit(user.id, payload);
    },
    [selectedPermissionIds, user, onSubmit, baseRolePermIds],
  );

  const userName = user
    ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email
    : "";

  const fields = useMemo(() => {
    const baseFields = [
      {
        name: "firstName",
        label: t("fields.firstName") || "First Name",
        type: "text",
        required: true,
        fullWidth: false,
      },
      {
        name: "lastName",
        label: t("fields.lastName") || "Last Name",
        type: "text",
        required: true,
        fullWidth: false,
      },
      {
        name: "email",
        label: t("fields.email") || "Email",
        type: "email",
        required: true,
        fullWidth: true,
      },
      {
        name: "phone",
        label: t("fields.phone") || "Phone",
        type: "tel",
        fullWidth: true,
      },
      {
        name: "password",
        label: t("fields.password") || "Password",
        type: "password",
        required: !user,
        placeholder: user ? t("messages.leaveBlankToKeep") || "Leave blank to keep current" : "",
        fullWidth: true,
      },
      {
        name: "roles",
        label: t("pages.userRoles.selectRoles") || "Assign Role",
        type: "select",
        placeholder: t("pages.userRoles.selectRolesPlaceholder") || "Select a role",
        options: roleOptions,
        fullWidth: true,
        onChange: (val) => setSelectedRoleId(val),
      },
    ];

    // if (isSuperAdmin) {
    //   baseFields.push({
    //     name: "serviceLocationId",
    //     label: t("common.location") || "Location",
    //     type: "custom",
    //     component: (props) => <ServiceLocationSelector {...props} />,
    //     render: (val) => <LocationName id={val} />,
    //     rules: [{ required: true, message: t("common.locationRequired") || "Required" }],
    //     fullWidth: true,
    //   });
    // }

    return baseFields;
  }, [t, roleOptions, user, isSuperAdmin]);

  const initialData = useMemo(() => {
    const roleEntry = user?.userRolePermission?.find(urp => urp.roleId && urp.role);
    const currentRoleId = roleEntry ? roleEntry.roleId : null;

    return {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      roles: currentRoleId,
      // serviceLocationId: user?.serviceLocationId,
    };
  }, [user]);

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={
        user
          ? `${t("modals.user") || "User"} — ${userName}`
          : t("modals.user") || "User"
      }
      data={initialData}
      fields={fields}
      mode={user ? "edit" : "edit"}
      isCreateMode={!user}
      loading={isSubmitting}
    >
      <div style={{ padding: "0 24px" }}>
        <Checkbox
          checked={showDirectPermissions}
          onChange={(e) => setShowDirectPermissions(e.target.checked)}
          style={{ marginBottom: 16 }}
        >
          {t("pages.userRoles.overridePermissions") ||
            "Override with direct permissions"}
        </Checkbox>

        {showDirectPermissions && (
          <div className={styles.directPermissionsSection}>
            <div className={styles.directPermissionsTitle}>
              {t("pages.userRoles.directPermissions") || "Direct Permissions"}
            </div>
            <div className={styles.permissionGroups}>
              {groupedPermissions.map((group) => (
                <div key={group.resource} className={styles.permissionGroup}>
                  <div className={styles.permissionGroupHeader}>
                    <span className={styles.permissionGroupTitle}>
                      {group.label}
                    </span>
                  </div>
                  <div className={styles.permissionGroupItems}>
                    {group.permissions.map((perm) => {
                      const isLocked = lockedPermissionIds.includes(perm.id);
                      return (
                        <Checkbox
                          key={perm.id}
                          checked={selectedPermissionIds.includes(perm.id)}
                          disabled={isLocked && selectedPermissionIds.includes(perm.id)}
                          onChange={(e) =>
                            handleTogglePermission(perm.id, e.target.checked)
                          }
                        >
                          {perm.actionLabel}
                        </Checkbox>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DetailModal>
  );
};

UserRoleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  roles: PropTypes.arrayOf(PropTypes.object),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default memo(UserRoleModal);
