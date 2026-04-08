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
import { useDashboardData } from "@/hooks/useAnalytics";
import { useTranslation } from "@/hooks/useTranslation";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import { safeMap } from "@/utils/safeRendering";
import { useMemo } from "react";
import styles from "../../../styles/dashboard.module.css";

const Dashboard = () => {
  const { t } = useTranslation();
  const { data: dashboardData, isLoading } = useDashboardData();

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

  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader
        titleKey="pages.dashboard.title"
        subtitleKey="pages.dashboard.subtitle"
      />

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
