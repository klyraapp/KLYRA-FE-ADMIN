/**
 * AuthGuard Component
 * Protects routes from unauthorized access
 * Redirects to login if not authenticated
 */

import { meAuth } from "@/api/authApi";
import { login, logout } from "@/redux/reducers/authSlice";
import { setProfileData } from "@/redux/reducers/userState";
import { getAccessTokenCookie } from "@/utils/axiosMiddleware";
import { deleteCookie } from "@/utils/utils";
import { Spin } from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    router.pathname.startsWith(route),
  );

  const validateAuth = useCallback(async () => {
    const accessToken = getAccessTokenCookie("access_token");

    if (!accessToken) {
      dispatch(logout());
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await meAuth();
      const userData = response?.data;

      if (userData) {
        dispatch(login(userData));
        dispatch(
          setProfileData({
            profileName:
              `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
            email: userData.email || "",
            role: userData.roles?.[0]?.name || "",
            permissions: userData.permissions || [],
            id: userData.id,
            userLanguage: userData.languagePreference || "en",
          }),
        );
        setIsAuthorized(true);
      } else {
        dispatch(logout());
        setIsAuthorized(false);
      }
    } catch {
      dispatch(logout());
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isPublicRoute) {
      setIsLoading(false);
      setIsAuthorized(true);
      return;
    }

    validateAuth();
  }, [isPublicRoute, validateAuth]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const hasToken = Boolean(getAccessTokenCookie("access_token"));

    if (!isAuthorized && !isPublicRoute && !hasToken) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isPublicRoute && hasToken) {
      router.replace("/");
    }
  }, [isLoading, isAuthorized, isAuthenticated, isPublicRoute, router]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!isAuthorized && !isPublicRoute) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Spin size="large" tip="Redirecting..." />
      </div>
    );
  }

  return children;
};

export default AuthGuard;
