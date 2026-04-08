/**
 * DetailSection Helper Functions
 * Utility functions to generate section configurations for common use cases
 */

import { getSafeValue, safeMap } from "@/utils/safeRendering";
import styles from "./DetailSection.module.css";

const StatusBadge = ({ status, activeValue = true }) => (
  <span
    className={`${styles.statusBadge} ${status === activeValue ? styles.statusActive : styles.statusInactive}`}
  >
    {typeof status === "boolean"
      ? status
        ? "Active"
        : "Inactive"
      : String(status)}
  </span>
);

export const createExtraServicesSection = (extraServices) => {
  if (!extraServices || extraServices.length === 0) {
    return [];
  }

  return [
    {
      key: "extra-services",
      title: "Extra Services",
      data: extraServices,
      columns: [
        {
          key: "id",
          title: "ID",
          dataIndex: "id",
          width: "60px",
        },
        {
          key: "name",
          title: "Name",
          dataIndex: "name",
          width: "150px",
        },
        {
          key: "description",
          title: "Description",
          dataIndex: "description",
        },
        {
          key: "price",
          title: "Price",
          dataIndex: "price",
          width: "100px",
          render: (price) => `${parseFloat(price || 0).toFixed(2)} NOK`,
        },
        {
          key: "displayOrder",
          title: "Order",
          dataIndex: "displayOrder",
          width: "80px",
        },
        {
          key: "status",
          title: "Status",
          dataIndex: "isActive",
          width: "100px",
          render: (isActive) => <StatusBadge status={isActive} />,
        },
      ],
      emptyMessage: "No extra services available",
    },
  ];
};

export const createBookingExtraServicesSections = (bookingExtraServices) => {
  if (!bookingExtraServices || bookingExtraServices.length === 0) {
    return [];
  }

  // Flatten the data for display
  const displayData = safeMap(bookingExtraServices, (item) => ({
    id: item?.extraServiceId || item?.id,
    name: item?.extraService?.name || "Extra Service",
    price: item?.price,
    quantity: item?.quantity,
    total: parseFloat(item?.price || 0) * (item?.quantity || 1),
    description: item?.extraService?.description || "-",
  }));

  return [
    {
      key: "booking-extra-services",
      title: "Extra Services",
      data: displayData,
      columns: [
        {
          key: "name",
          title: "Service Name",
          dataIndex: "name",
          width: "200px",
        },
        {
          key: "description",
          title: "Description",
          dataIndex: "description",
        },
        {
          key: "price",
          title: "Price",
          dataIndex: "price",
          width: "120px",
          render: (price) => `${parseFloat(price || 0).toFixed(2)} NOK`,
        },
        {
          key: "quantity",
          title: "Qty",
          dataIndex: "quantity",
          width: "80px",
        },
        {
          key: "total",
          title: "Total",
          dataIndex: "total",
          width: "120px",
          render: (total) => `${parseFloat(total || 0).toFixed(2)} NOK`,
        },
      ],
      emptyMessage: "No extra services for this booking",
    },
  ];
};

export const createSubscriptionSections = (subscription) => {
  if (!subscription) {
    return [];
  }

  const sections = [];

  sections.push({
    key: "subscription-details",
    title: "Subscription Details",
    data: [subscription],
    columns: [
      {
        key: "id",
        title: "ID",
        dataIndex: "id",
        width: "60px",
      },
      {
        key: "status",
        title: "Status",
        dataIndex: "status",
        width: "100px",
        render: (status) => (
          <StatusBadge status={status} activeValue="ACTIVE" />
        ),
      },
      {
        key: "recurringIntervalType",
        title: "Interval",
        dataIndex: "recurringIntervalType",
        width: "150px",
      },
      {
        key: "nextScheduledDate",
        title: "Next Scheduled",
        dataIndex: "nextScheduledDate",
        render: (date) => (date ? new Date(date).toLocaleString() : "-"),
      },
      {
        key: "lastNotificationSentAt",
        title: "Last Notification",
        dataIndex: "lastNotificationSentAt",
        render: (date) => (date ? new Date(date).toLocaleString() : "-"),
      },
      {
        key: "createdAt",
        title: "Created At",
        dataIndex: "createdAt",
        render: (date) => (date ? new Date(date).toLocaleString() : "-"),
      },
    ],
    emptyMessage: "No subscription information available",
  });

  // if (subscription.stripePaymentInfo) {
  //   sections.push({
  //     key: "stripe-payment",
  //     title: "Stripe Payment Information",
  //     data: [subscription.stripePaymentInfo],
  //     columns: [
  //       {
  //         key: "customer",
  //         title: "Customer",
  //         dataIndex: "customer",
  //       },
  //       {
  //         key: "paymentMethod",
  //         title: "Payment Method",
  //         dataIndex: "paymentMethod",
  //       },
  //     ],
  //     emptyMessage: "No Stripe payment information",
  //   });
  // }

  // if (subscription.vippsPaymentInfo) {
  //   sections.push({
  //     key: "vipps-payment",
  //     title: "Vipps Payment Information",
  //     data: [subscription.vippsPaymentInfo],
  //     columns: [
  //       {
  //         key: "customer",
  //         title: "Customer",
  //         dataIndex: "customer",
  //       },
  //       {
  //         key: "paymentMethod",
  //         title: "Payment Method",
  //         dataIndex: "paymentMethod",
  //       },
  //     ],
  //     emptyMessage: "No Vipps payment information",
  //   });
  // }

  return sections;
};

export const createChildRulesSection = (childRules) => {
  if (!childRules || childRules.length === 0) {
    return [];
  }

  return [
    {
      key: "child-rules",
      title: "Additional Area Cost (Step Rules)",
      data: childRules,
      columns: [
        {
          key: "id",
          title: "ID",
          dataIndex: "id",
          width: "60px",
        },
        {
          key: "ruleType",
          title: "Rule Type",
          dataIndex: "ruleType",
          width: "100px",
        },
        {
          key: "maxAreaLimit",
          title: "Max Area Limit",
          dataIndex: "maxAreaLimit",
          width: "120px",
          render: (val) =>
            val !== null && val !== undefined ? `${val} m²` : "-",
        },
        {
          key: "price",
          title: "Price",
          dataIndex: "price",
          width: "100px",
          render: (price) =>
            `${parseFloat(price || 0).toFixed(2)} NOK`,
        },
        {
          key: "stepSize",
          title: "Step Size",
          dataIndex: "stepSize",
          width: "80px",
          render: (val) =>
            val !== null && val !== undefined ? val : "-",
        },
      ],
      emptyMessage: "No additional area cost rules defined",
      showEmpty: true,
    },
  ];
};

export const createPricingRulesSection = (pricingRules) => {
  if (!pricingRules || pricingRules.length === 0) {
    return [];
  }

  return [
    {
      key: "pricing-rules",
      title: "Pricing Rules",
      data: pricingRules,
      columns: [
        {
          key: "id",
          title: "ID",
          dataIndex: "id",
          width: "60px",
        },
        {
          key: "name",
          title: "Name",
          dataIndex: "name",
          width: "150px",
          render: (name) => name || "-",
        },
        {
          key: "ruleType",
          title: "Rule Type",
          dataIndex: "ruleType",
          width: "100px",
        },
        {
          key: "serviceType",
          title: "Service Type",
          dataIndex: "serviceType",
          width: "120px",
          render: (type) => {
            if (!type) return "-";
            return type === "ONE_TIME" ? "One Time" : "Recurring";
          },
        },
        {
          key: "price",
          title: "Base Price",
          dataIndex: "price",
          width: "100px",
          render: (price) =>
            `${parseFloat(price || 0).toFixed(2)} NOK`,
        },
        {
          key: "stepRules",
          title: "Step Rules (Additional Cost)",
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
                      (Step: {getSafeValue(cr?.stepSize)})
                    </span>
                  </div>
                ))}
              </div>
            );
          },
        },
      ],
      emptyMessage: "No pricing rules assigned",
      showEmpty: true,
    },
  ];
};
