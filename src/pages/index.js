/**
 * Index Page
 * Renders the Dashboard as the default landing page.
 * Handles redirection to the first available route if the user lacks dashboard permissions.
 */

import usePermission from "@/hooks/usePermission";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import { SIDEBAR_PERMISSIONS } from "@/utils/sidebarPermissions";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dashboard from "./dashboard/Dashboard";
import { Spin } from "antd";

const IndexPage = () => {
  const { can, canAny } = usePermission();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const hasDashboardAccess = can(PERMISSION_KEYS.DASHBOARD_READ);

    if (!hasDashboardAccess) {
      // Find the first route from sidebar config (excluding root itself) that the user can access
      const routes = Object.keys(SIDEBAR_PERMISSIONS).filter(
        (route) => route !== "/",
      );

      const firstAvailableRoute = routes.find((route) => {
        const requiredPermission = SIDEBAR_PERMISSIONS[route];

        if (!requiredPermission) return false;

        if (Array.isArray(requiredPermission)) {
          return canAny(requiredPermission);
        }
        return can(requiredPermission);
      });

      if (firstAvailableRoute) {
        setIsRedirecting(true);
        router.replace(firstAvailableRoute);
      }
    }
  }, [can, canAny, router]);

  if (isRedirecting) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return <Dashboard />;
};

export default IndexPage;
