/**
 * Dashboard Page
 * Main dashboard for cleaning service business overview
 * Pixel-perfect implementation matching the design
 */

import AntTable from "@/components/AntTable/AntTable";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ServiceDistribution from "@/components/dashboard/ServiceDistribution/ServiceDistribution";
import ServiceRequestChart from "@/components/dashboard/ServiceRequestChart/ServiceRequestChart";
import StatsCard from "@/components/dashboard/StatsCard/StatsCard";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import ServiceLocationSelector from "@/components/common/ServiceLocationSelector";
import { useDashboardData } from "@/hooks/useAnalytics";
import { useTranslation } from "@/hooks/useTranslation";
import { Spin } from "antd";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import { safeMap } from "@/utils/safeRendering";
import { useMemo, useEffect, useState, useCallback } from "react";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import { SIDEBAR_PERMISSIONS } from "@/utils/sidebarPermissions";
import usePermission from "@/hooks/usePermission";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectIsSuperAdmin } from "@/redux/reducers/permissionSlice";
import styles from "../../../styles/dashboard.module.css";

const Dashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { can, canAny } = usePermission();
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const [locationFilter, setLocationFilter] = useState(null);

  const dashboardParams = useMemo(() => {
    const params = {};
    if (locationFilter && locationFilter !== "all") {
      params.serviceLocationId = locationFilter;
    }
    return params;
  }, [locationFilter]);

  const { data: dashboardData, isLoading } = useDashboardData(dashboardParams);

  const handleLocationChange = useCallback((value) => {
    setLocationFilter(value);
  }, []);

  // Redirect to the first available route if user doesn't have dashboard access
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
        router.replace(firstAvailableRoute);
      }
    }
  }, [can, canAny, router]);

  const stats = useMemo(() => {
    if (!dashboardData?.summary) return [];

    const summary = dashboardData.summary;
    const totalBookings = summary.totalBookings || {};
    const pending = summary.pending || {};
    const revenue = summary.revenue || {};
    const activeCustomers = summary.activeCustomers || {};

    return [
      {
        id: 1,
        title: t("dashboard.totalBookings"),
        value: Number(activeCustomers.value || 0).toLocaleString(),
        percentage: `${totalBookings.change || 0}%`,
        trend: parseFloat(totalBookings.change || 0) >= 0 ? "up" : "down",
        icon: "bookings",
        variant: "green",
      },
      {
        id: 2,
        title: t("dashboard.pending"),
        value: Number(pending.value || 0).toLocaleString(),
        percentage: `${pending.change || 0}%`,
        trend: parseFloat(pending.change || 0) >= 0 ? "up" : "down",
        icon: "pending",
        variant: "yellow",
      },
      {
        id: 3,
        title: t("dashboard.revenue"),
        value: `NOK ${Number(revenue.value || 0).toLocaleString()}`,
        percentage: `${revenue.change || 0}%`,
        trend: parseFloat(revenue.change || 0) >= 0 ? "up" : "down",
        icon: "revenue",
        variant: "red",
      },
      {
        id: 4,
        title: t("dashboard.activeCustomers"),
        value: Number(activeCustomers.value || 0).toLocaleString(),
        percentage: `${activeCustomers.change || 0}%`,
        trend: parseFloat(activeCustomers.change || 0) >= 0 ? "up" : "down",
        icon: "customers",
        variant: "blue",
      },
    ];
  }, [dashboardData, t]);

  const chartData = useMemo(() => {
    return safeMap(dashboardData?.trends, (item) => ({
      month: item?.month || "",
      requests: item?.bookings || 0,
      trend: item?.bookings || 0,
    }), []);
  }, [dashboardData]);

  const serviceDistribution = useMemo(() => {
    const data = Array.isArray(dashboardData?.serviceDistribution) ? dashboardData.serviceDistribution : [];
    const colors = ["red", "green", "blue", "yellow", "purple"];
    const totalBookings = data.reduce(
      (sum, item) => sum + (item?.bookings || 0),
      0,
    );

    return data.map((item, index) => {
      const bookings = item?.bookings || 0;
      const percentage =
        totalBookings > 0 ? Math.round((bookings / totalBookings) * 100) : 0;

      return {
        id: index + 1,
        name: item?.name || "Unknown",
        bookings,
        percentage: Math.max(percentage, 10),
        color: colors[index % colors.length],
      };
    });
  }, [dashboardData]);

  const recentBookings = useMemo(() => {
    return safeMap(dashboardData?.recentBookings, (booking) => ({
      id: booking?.id || "",
      customerId: booking?.id || "-",
      name: booking?.name || "-",
      email: booking?.email || "-",
      dateTime: booking?.dateTime || "-",
      status:
        booking?.status === "CONFIRMED" || booking?.status === "COMPLETED"
          ? "active"
          : "inactive",
    }), []);
  }, [dashboardData]);

  const bookingsColumns = useMemo(
    () => [
      {
        title: t("table.customerId"),
        dataIndex: "customerId",
        key: "customerId",
      },
      {
        title: t("table.name"),
        dataIndex: "name",
        key: "name",
      },
      {
        title: t("table.email"),
        dataIndex: "email",
        key: "email",
      },
      {
        title: t("table.date"),
        dataIndex: "dateTime",
        key: "dateTime",
      },
      {
        title: t("table.status"),
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <StatusBadge status={status === "active" ? "active" : "inactive"} />
        ),
      },
    ],
    [t],
  );

  const hasDashboardAccess = can(PERMISSION_KEYS.DASHBOARD_READ);

  if (!hasDashboardAccess) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" tip="Redirecting..." />
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader
        titleKey="pages.dashboard.title"
        subtitleKey="pages.dashboard.subtitle"
      >
        {isSuperAdmin && (
          <ServiceLocationSelector
            value={locationFilter}
            onChange={handleLocationChange}
            showAllOption
            style={{ width: 180 }}
          />
        )}
      </DashboardHeader>

      <div className={styles.statsGrid}>
        <ErrorBoundary>
          {safeMap(stats, (stat) => (
            <StatsCard
              key={stat?.id}
              title={stat?.title}
              value={stat?.value}
              percentage={stat?.percentage}
              trend={stat?.trend}
              icon={stat?.icon}
              variant={stat?.variant}
            />
          ))}
        </ErrorBoundary>
      </div>

      <div className={styles.chartsRow}>
        <ErrorBoundary>
          <ServiceRequestChart
            data={chartData}
            title={t("dashboard.serviceRequests")}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <ServiceDistribution
            data={serviceDistribution}
            title={t("dashboard.serviceDistribution")}
          />
        </ErrorBoundary>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>{t("dashboard.recentBookings")}</h3>
          <ErrorBoundary>
            <AntTable
              columns={bookingsColumns}
              dataSource={recentBookings}
              rowKey="id"
              showPagination={false}
              loading={isLoading}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
