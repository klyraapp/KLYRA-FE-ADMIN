import api from "@/utils/axiosMiddleware";

export const getRoles = () => api.get("/roles");

export const getPermissions = () => api.get("/permissions");

export const createRole = (data) => api.post("/roles", data);

export const updateRole = (params, data) => api.patch(`/roles/${params}`, data);

export const deleteRole = (params) => api.delete(`/roles/${params}`);
