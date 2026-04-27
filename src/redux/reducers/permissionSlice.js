/**
 * Permission Redux Slice
 * Stores normalized user permissions, roles, and super-admin flag.
 * Populated by AuthGuard after /me API response.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  normalizedPermissions: [],
  permissionSet: [],
  userRoles: [],
  isSuperAdmin: false,
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    /**
     * Sets the user's normalized permissions, roles, and super-admin flag.
     * @param {object} action.payload
     * @param {Array<string>} action.payload.normalizedPermissions
     * @param {Array<string>} action.payload.userRoles
     * @param {boolean} action.payload.isSuperAdmin
     */
    setPermissions: (state, action) => {
      const {
        normalizedPermissions = [],
        userRoles = [],
        isSuperAdmin = false,
      } = action.payload;

      state.normalizedPermissions = normalizedPermissions;
      state.permissionSet = normalizedPermissions;
      state.userRoles = userRoles;
      state.isSuperAdmin = isSuperAdmin;
    },

    clearPermissions: () => initialState,
  },
});

/* Selectors */
const selectPermissions = (state) =>
  state.permissions.normalizedPermissions;

const selectPermissionSet = (state) =>
  state.permissions.permissionSet;

const selectUserRoles = (state) =>
  state.permissions.userRoles;

const selectIsSuperAdmin = (state) =>
  state.permissions.isSuperAdmin;

export const { setPermissions, clearPermissions } = permissionSlice.actions;

export {
  selectPermissions,
  selectPermissionSet,
  selectUserRoles,
  selectIsSuperAdmin,
};

export default permissionSlice.reducer;
