import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import userReducer from "./reducers/userState";
import rolesReducer from "./reducers/rolesState";
import permissionReducer from "./reducers/permissionSlice";

const appReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  roles: rolesReducer,
  permissions: permissionReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // Reset all state to initial values
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default configureStore({
  reducer: rootReducer,
});
