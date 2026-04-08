/**
 * useAuth Hook
 * Provides authentication state and logout functionality
 */

import { logout } from "@/redux/reducers/authSlice";
import { deleteCookie } from "@/utils/utils";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    localStorage.removeItem("rememberedEmail");
    router.push("/login");
  }, [dispatch, router]);

  return {
    isAuthenticated,
    user,
    handleLogout,
  };
};

export default useAuth;
