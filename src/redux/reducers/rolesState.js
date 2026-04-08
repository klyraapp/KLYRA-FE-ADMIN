import { createSlice } from "@reduxjs/toolkit";

export const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    rolesModal: false,
    rolesModalD: false,
    selectedRole: {},
  },
  reducers: {
    setRolesModal: (state, action) => {
      state.rolesModal = action.payload;
    },
    setRolesModalDelete: (state, action) => {
      state.rolesModalD = action.payload;
    },
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
  },
});

export const { setRolesModal, setRolesModalDelete, setSelectedRole } =
  rolesSlice.actions;

export default rolesSlice.reducer;
