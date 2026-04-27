/**
 * usePermission Hook
 * Provides permission checking functions for RBAC enforcement.
 * Reads from the Redux permission store and handles super_admin bypass.
 */

import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectIsSuperAdmin,
  selectPermissions,
} from "@/redux/reducers/permissionSlice";

/**
 * Hook that provides permission-checking utilities.
 *
 * @returns {{
 *   can: (permission: string) => boolean,
 *   canAny: (permissions: string[]) => boolean,
 *   canAll: (permissions: string[]) => boolean,
 *   isSuperAdmin: boolean,
 *   permissions: string[],
 * }}
 */
const usePermission = () => {
  const permissions = useSelector(selectPermissions);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  const permissionSet = useMemo(
    () => new Set(permissions),
    [permissions],
  );

  /**
   * Checks if the user has a specific permission.
   * Super admins always return true.
   * Handles implicit read access: if "resource:read" is requested, 
   * returns true if user has "resource:read_all".
   *
   * @param {string} permission - Normalized permission string (e.g., "user:create").
   * @returns {boolean}
   */
  const can = useCallback(
    (permission) => {
      if (isSuperAdmin) {
        return true;
      }

      if (!permission) {
        return true;
      }

      // Check for exact match
      if (permissionSet.has(permission)) {
        return true;
      }

      // Handle implicit read access (read_all implies read)
      if (permission.endsWith(":read")) {
        const readAllPerm = permission.replace(":read", ":read_all");
        if (permissionSet.has(readAllPerm)) {
          return true;
        }
      }

      // Handle implicit viewall (some might check for read_all but user only has read)
      if (permission.endsWith(":read_all")) {
        const readPerm = permission.replace(":read_all", ":read");
        if (permissionSet.has(readPerm)) {
          return true;
        }
      }

      return false;
    },
    [isSuperAdmin, permissionSet],
  );

  /**
   * Checks if the user has at least one of the given permissions.
   *
   * @param {string[]} permissionList - Array of normalized permission strings.
   * @returns {boolean}
   */
  const canAny = useCallback(
    (permissionList = []) => {
      if (isSuperAdmin) {
        return true;
      }

      if (!Array.isArray(permissionList) || permissionList.length === 0) {
        return true;
      }

      return permissionList.some((perm) => can(perm));
    },
    [isSuperAdmin, can],
  );

  /**
   * Checks if the user has all of the given permissions.
   *
   * @param {string[]} permissionList - Array of normalized permission strings.
   * @returns {boolean}
   */
  const canAll = useCallback(
    (permissionList = []) => {
      if (isSuperAdmin) {
        return true;
      }

      if (!Array.isArray(permissionList) || permissionList.length === 0) {
        return true;
      }

      return permissionList.every((perm) => can(perm));
    },
    [isSuperAdmin, can],
  );

  return {
    can,
    canAny,
    canAll,
    isSuperAdmin,
    permissions,
  };
};

export default usePermission;
