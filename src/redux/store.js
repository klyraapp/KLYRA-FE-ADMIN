import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducers/authSlice";
import userReducer from "./reducers/userState";
import rolesReducer from "./reducers/rolesState";
import permissionReducer from "./reducers/permissionSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    roles: rolesReducer,
    permissions: permissionReducer,
  },
});
