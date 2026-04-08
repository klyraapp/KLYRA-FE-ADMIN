import { PERMISSIONS } from "@/utils/constant";

const permissionMap = new Map([
  [PERMISSIONS.ADD_USERS, "Add User"],
  [PERMISSIONS.EDIT_USERS, "Update User"],
  [PERMISSIONS.DELETE_USERS, "Delete User"],
  [PERMISSIONS.VIEW_USERS, "View User"],
  [PERMISSIONS.ADD_ROLES, "Add Role"],
  [PERMISSIONS.EDIT_ROLES, "Update role"],
  [PERMISSIONS.DELETE_ROLES, "Delete Role"],
  [PERMISSIONS.VIEW_ROLES, "View Role"],
  [PERMISSIONS.ADD_LOCATION, "Add Location"],
  [PERMISSIONS.EDIT_LOCATION, "Update Location"],
  [PERMISSIONS.DELETE_LOCATION, "Delete Location"],
  [PERMISSIONS.VIEW_LOCATION, "View Location"],
  [PERMISSIONS.ASSIGN_PERMISSION, "Assign Permission"],
]);

const defaultPermissions = (value) => value;

export const getPermissionEnum = (value) =>
  permissionMap.get(value) ?? defaultPermissions(value);

export const checkUserAssignPermissions = (param, permissions) => {
  for (let i = 0; i < permissions?.length; i++) {
    if (permissions[i].name === param) {
      return true;
    }
  }

  return false;
};

export const deleteCookie = (key) => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const setCookie = (name, value) => {
  const cookie = `${name}=${value};path=/;`;
  document.cookie = cookie;
};

export const setCookieWithExpiry = (name, value, days = 1) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;`;
};
