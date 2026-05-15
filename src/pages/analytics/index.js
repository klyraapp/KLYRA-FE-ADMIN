/**
 * Analytics Page
 * Displays analytics metrics, revenue trends, and top services
 * Uses reusable components
 */

import AnalyticsCard from "@/components/AnalyticsCard/AnalyticsCard";
import ServiceRequestChart from "@/components/dashboard/ServiceRequestChart/ServiceRequestChart";
import PageHeader from "@/components/PageHeader/PageHeader";
import TopServicesCard from "@/components/TopServicesCard/TopServicesCard";
import { useAnalyticsData } from "@/hooks/useAnalytics";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/analytics.module.css";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import ServiceLocationSelector from "@/components/common/ServiceLocationSelector";
import { safeMap } from "@/utils/safeRendering";
import { useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectIsSuperAdmin } from "@/redux/reducers/permissionSlice";

const AnalyticsPage = () => {
  const { t } = useTranslation();
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const [locationFilter, setLocationFilter] = useState(null);

  const analyticsParams = useMemo(() => {
    const params = {};
    if (locationFilter && locationFilter !== "all") {
      params.serviceLocationId = locationFilter;
    }
    return params;
  }, [locationFilter]);

  const { data: analyticsData, isLoading } = useAnalyticsData(analyticsParams);

  const handleLocationChange = useCallback((value) => {
    setLocationFilter(value);
  }, []);

  const analyticsCards = useMemo(() => {
    if (!analyticsData?.stats) return [];

    const stats = analyticsData.stats;
    const growthRate = stats.growthRate || {};
    const newCustomers = stats.newCustomers || {};
    const avgOrderValue = stats.avgOrderValue || {};

    return [
      {
        id: 1,
        title: t("analytics.growthRate"),
        value: growthRate.value || "0%",
        badgeText: growthRate.period || t("analytics.thisMonth"),
        icon: "growth",
        variant: "green",
      },
      {
        id: 2,
        title: t("analytics.newCustomers"),
        value: String(newCustomers.value || 0),
        badgeText: newCustomers.period || t("analytics.thisMonth"),
        icon: "customers",
        variant: "yellow",
      },
      {
        id: 3,
        title: t("analytics.avgOrderValue"),
        value: avgOrderValue.value || "$0",
        badgeText: avgOrderValue.period || t("analytics.thisMonth"),
        icon: "order",
        variant: "blue",
      },
    ];
  }, [analyticsData, t]);

  const chartData = useMemo(() => {
    return safeMap(analyticsData?.revenueTrend, (item) => ({
      month: item?.month || "",
      requests: item?.revenue || 0,
      trend: item?.revenue || 0,
    }), []);
  }, [analyticsData]);

  const topServices = useMemo(() => {
    return safeMap(analyticsData?.topServices, (service, index) => ({
      id: index + 1,
      name: service?.name || "Unknown",
      price: service?.revenue ? `NOK ${Number(service.revenue || 0).toLocaleString()}`: "NOK 0",
      growth: `+${service?.sales || 0}`,
      sales: `${service?.sales || 0} sales`,
    }), []);
  }, [analyticsData]);

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <PageHeader
          titleKey="pages.analytics.title"
          subtitleKey="pages.analytics.subtitle"
        >
          {isSuperAdmin && (
            <ServiceLocationSelector
              value={locationFilter}
              onChange={handleLocationChange}
              showAllOption
              style={{ width: 180 }}
            />
          )}
        </PageHeader>
        <div className={styles.statsGrid}>{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        titleKey="pages.analytics.title"
        subtitleKey="pages.analytics.subtitle"
      >
        {isSuperAdmin && (
          <ServiceLocationSelector
            value={locationFilter}
            onChange={handleLocationChange}
            showAllOption
            style={{ width: 180 }}
          />
        )}
      </PageHeader>

      <div className={styles.statsGrid}>
        <ErrorBoundary>
          {safeMap(analyticsCards, (card) => (
            <AnalyticsCard
              key={card?.id}
              title={card?.title}
              value={card?.value}
              badgeText={card?.badgeText}
              icon={card?.icon}
              variant={card?.variant}
            />
          ))}
        </ErrorBoundary>
      </div>

      <div className={styles.chartSection}>
        <ErrorBoundary>
          <ServiceRequestChart
            data={chartData}
            title={t("analytics.revenueTrends")}
          />
        </ErrorBoundary>
      </div>

      <div className={styles.topServicesSection}>
        <ErrorBoundary>
          <TopServicesCard
            title={t("analytics.topServices")}
            data={topServices}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default AnalyticsPage;
