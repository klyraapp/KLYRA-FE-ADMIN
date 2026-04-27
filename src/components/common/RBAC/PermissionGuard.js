/**
 * PermissionGuard Component
 * Declarative component-level permission wrapper.
 * Renders children only if the user has the required permission(s).
 */

import { memo } from "react";
import PropTypes from "prop-types";
import usePermission from "@/hooks/usePermission";

/**
 * Wraps child elements with a permission check.
 * If the user lacks permission, renders the fallback (or nothing).
 *
 * @example
 * <PermissionGuard permission="user:create">
 *   <Button>Create User</Button>
 * </PermissionGuard>
 *
 * @example
 * <PermissionGuard permissions={["user:create", "user:update"]} requireAll={false}>
 *   <EditPanel />
 * </PermissionGuard>
 */
const PermissionGuard = ({
  permission,
  permissions,
  requireAll,
  fallback,
  children,
}) => {
  const { can, canAny, canAll } = usePermission();

  const hasAccess = (() => {
    if (permission) {
      return can(permission);
    }

    if (permissions && permissions.length > 0) {
      return requireAll ? canAll(permissions) : canAny(permissions);
    }

    return true;
  })();

  if (!hasAccess) {
    return fallback || null;
  }

  return children;
};

PermissionGuard.propTypes = {
  permission: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string),
  requireAll: PropTypes.bool,
  fallback: PropTypes.node,
  children: PropTypes.node.isRequired,
};

PermissionGuard.defaultProps = {
  permission: null,
  permissions: [],
  requireAll: false,
  fallback: null,
};

export default memo(PermissionGuard);
