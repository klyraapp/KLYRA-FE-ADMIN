/**
 * DetailSection Helper Functions
 * Utility functions to generate section configurations for common use cases
 */

import { getSafeValue, safeMap } from "@/utils/safeRendering";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./DetailSection.module.css";

const StatusBadge = ({ status, activeValue = true }) => {
  const { t } = useTranslation();

  const getLabel = () => {
    if (status === "EXPIRED") return t("status.expired");
    if (status === "ACTIVE") return t("status.paid");
    if (status === "PENDING") return t("status.unpaid");
    if (status === "CANCELLED") return t("status.cancelled");

    if (typeof status === "boolean") {
      return status ? t("common.active") : t("common.inactive");
    }

    return String(status);
  };

  return (
    <span
      className={`${styles.statusBadge} ${status === activeValue ? styles.statusActive : styles.statusInactive}`}
    >
      {getLabel()}
    </span>
  );
};

export const createExtraServicesSection = (extraServices, t) => {
  if (!extraServices || extraServices.length === 0) {
    return [];
  }

  return [
    {
      key: "extra-services",
      title: t("navigation.additionalServices"),
      data: extraServices,
      columns: [
        {
          key: "id",
          title: t("table.id") || "ID",
          dataIndex: "id",
          width: "60px",
        },
        {
          key: "name",
          title: t("table.name"),
          dataIndex: "name",
          width: "150px",
        },
        {
          key: "description",
          title: t("table.description"),
          dataIndex: "description",
        },
        {
          key: "price",
          title: t("table.price"),
          dataIndex: "price",
          width: "100px",
          render: (price) => `${parseFloat(price || 0).toFixed(2)} NOK`,
        },
        {
          key: "displayOrder",
          title: t("table.order"),
          dataIndex: "displayOrder",
          width: "80px",
        },
        {
          key: "status",
          title: t("table.status"),
          dataIndex: "isActive",
          width: "100px",
          render: (isActive) => <StatusBadge status={isActive} />,
        },
      ],
      emptyMessage: t("table.noData"),
    },
  ];
};

export const createBookingExtraServicesSections = (bookingExtraServices, t) => {
  if (!bookingExtraServices || bookingExtraServices.length === 0) {
    return [];
  }

  // Flatten the data for display
  const displayData = safeMap(bookingExtraServices, (item) => ({
    id: item?.extraServiceId || item?.id,
    name: item?.extraService?.name || t("common.unknown"),
    price: item?.price,
    quantity: item?.quantity,
    total: parseFloat(item?.price || 0) * (item?.quantity || 1),
    description: item?.extraService?.description || "-",
  }));

  return [
    {
      key: "booking-extra-services",
      title: t("table.extraServices"),
      data: displayData,
      columns: [
        {
          key: "name",
          title: t("table.serviceName"),
          dataIndex: "name",
          width: "200px",
        },
        {
          key: "description",
          title: t("table.description"),
          dataIndex: "description",
        },
        {
          key: "price",
          title: t("table.price"),
          dataIndex: "price",
          width: "120px",
          render: (price) => `${parseFloat(price || 0).toFixed(2)} NOK`,
        },
        {
          key: "quantity",
          title: t("table.qty"),
          dataIndex: "quantity",
          width: "80px",
        },
        {
          key: "total",
          title: t("table.total"),
          dataIndex: "total",
          width: "120px",
          render: (total) => `${parseFloat(total || 0).toFixed(2)} NOK`,
        },
      ],
      emptyMessage: t("table.noData"),
    },
  ];
};

export const createSubscriptionSections = (subscription, t) => {
  if (!subscription) {
    return [];
  }

  const sections = [];

  sections.push({
    key: "subscription-details",
    title: t("pages.subscriptions.sections.details"),
    data: [subscription],
    columns: [
      {
        key: "id",
        title: t("pages.subscriptions.sections.id"),
        dataIndex: "id",
        width: "60px",
      },
      {
        key: "status",
        title: t("pages.subscriptions.sections.status"),
        dataIndex: "status",
        width: "100px",
        render: (status) => (
          <StatusBadge status={status} activeValue="ACTIVE" />
        ),
      },
      {
        key: "recurringIntervalType",
        title: t("pages.subscriptions.sections.interval"),
        dataIndex: "recurringIntervalType",
        width: "150px",
      },
      {
        key: "nextScheduledDate",
        title: t("pages.subscriptions.sections.nextScheduled"),
        dataIndex: "nextScheduledDate",
        render: (date) => (date ? new Date(date).toLocaleString() : "-"),
      },
      {
        key: "lastNotificationSentAt",
        title: t("pages.subscriptions.sections.lastNotification"),
        dataIndex: "lastNotificationSentAt",
        render: (date) => (date ? new Date(date).toLocaleString() : "-"),
      },
      {
        key: "createdAt",
        title: t("pages.subscriptions.sections.createdAt"),
        dataIndex: "createdAt",
        render: (date) => (date ? new Date(date).toLocaleString() : "-"),
      },
    ],
    emptyMessage: t("pages.subscriptions.sections.noInfo"),
  });

  return sections;
};

export const createChildRulesSection = (childRules, t) => {
  if (!childRules || childRules.length === 0) {
    return [];
  }

  return [
    {
      key: "child-rules",
      title: t("table.childRules") || "Additional Area Cost (Step Rules)",
      data: childRules,
      columns: [
        {
          key: "id",
          title: t("table.id") || "ID",
          dataIndex: "id",
          width: "60px",
        },
        {
          key: "ruleType",
          title: t("table.ruleType"),
          dataIndex: "ruleType",
          width: "100px",
        },
        {
          key: "maxAreaLimit",
          title: t("table.maxArea"),
          dataIndex: "maxAreaLimit",
          width: "120px",
          render: (val) =>
            val !== null && val !== undefined ? `${val} m²` : "-",
        },
        {
          key: "price",
          title: t("table.price"),
          dataIndex: "price",
          width: "100px",
          render: (price) =>
            `${parseFloat(price || 0).toFixed(2)} NOK`,
        },
        {
          key: "stepSize",
          title: t("table.stepSize"),
          dataIndex: "stepSize",
          width: "80px",
          render: (val) =>
            val !== null && val !== undefined ? val : "-",
        },
      ],
      emptyMessage: t("table.noData"),
      showEmpty: true,
    },
  ];
};

export const createPricingRulesSection = (pricingRules, t) => {
  if (!pricingRules || pricingRules.length === 0) {
    return [];
  }

  return [
    {
      key: "pricing-rules",
      title: t("navigation.pricingRules"),
      data: pricingRules,
      columns: [
        {
          key: "id",
          title: t("table.id") || "ID",
          dataIndex: "id",
          width: "60px",
        },
        {
          key: "name",
          title: t("table.name"),
          dataIndex: "name",
          width: "150px",
          render: (name) => name || "-",
        },
        {
          key: "ruleType",
          title: t("table.ruleType"),
          dataIndex: "ruleType",
          width: "100px",
        },
        {
          key: "serviceType",
          title: t("pages.pricingRules.fields.serviceType"),
          dataIndex: "serviceType",
          width: "120px",
          render: (type) => {
            if (!type) return "-";
            return type === "ONE_TIME" ? t("pages.pricingRules.fields.oneTime") : t("pages.pricingRules.fields.recurring");
          },
        },
        {
          key: "price",
          title: t("table.price"),
          dataIndex: "price",
          width: "100px",
          render: (price) =>
            `${parseFloat(price || 0).toFixed(2)} NOK`,
        },
        {
          key: "stepRules",
          title: t("pages.pricingRules.fields.childRules"),
          dataIndex: "childRules",
          width: "250px",
          render: (childRules) => {
            if (!childRules || childRules.length === 0) return "-";
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {safeMap(childRules, (cr, idx) => (
                  <div
                    key={cr?.id || idx}
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      background: "#f3f4f6",
                      borderRadius: "4px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <strong>{getSafeValue(cr?.maxAreaLimit)}m²</strong>: {parseFloat(cr?.price || 0).toFixed(2)} NOK
                    <span style={{ color: "#6b7280", marginLeft: "4px" }}>
                      ({t("table.stepSize")}: {getSafeValue(cr?.stepSize)})
                    </span>
                  </div>
                ))}
              </div>
            );
          },
        },
      ],
      emptyMessage: t("table.noData"),
      showEmpty: true,
    },
  ];
};
