/**
 * useTableColumns Hook
 * Provides translated table column definitions
 */

import RecurringIndicator from "@/components/common/RecurringIndicator";
import { getSafeValue } from "@/utils/safeRendering";
import { Tooltip, Tag } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { useTranslation } from "./useTranslation";

const useTableColumns = () => {
  const { t } = useTranslation();

  const getCustomersColumns = useMemo(
    () => (handleRowAction, styles, StatusBadge, ActionMenu, canUpdate = false, canDelete = false) => [
      {
        title: t("table.customerId"),
        dataIndex: "customerId",
        key: "customerId",
        width: 120,
      },
      {
        title: t("table.name"),
        dataIndex: "name",
        key: "name",
        width: 180,
        render: (name, record) => (
          <div className={styles.nameCell}>
            <span className={styles.customerName}>{getSafeValue(name)}</span>
            <span className={styles.customerEmail}>{getSafeValue(record?.email)}</span>
          </div>
        ),
      },
      {
        title: t("table.contact"),
        dataIndex: "contact",
        key: "contact",
        width: 130,
      },
      {
        title: t("table.joinDate"),
        dataIndex: "joinDate",
        key: "joinDate",
        width: 140,
      },
      {
        title: t("table.status"),
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (status) => <StatusBadge status={status} />,
      },
      {
        title: t("table.actions"),
        key: "actions",
        width: 80,
        align: "center",
        render: (_, record) => (
          <ActionMenu
            onAction={handleRowAction}
            record={record}
            items={[
              { key: "view", label: t("common.view") },
              ...(canUpdate ? [{ key: "edit", label: t("common.edit") }] : []),
              ...(canDelete
                ? [{ key: "delete", label: t("common.delete") }]
                : []),
            ]}
          />
        ),
      },
    ],
    [t],
  );

  const getBookingsColumns = useMemo(
    () =>
      (
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatArea,
        formatCurrency,
        formatDate,
        formatTime,
        formatBookingStatus,
        showEdit = false,
        showDelete = false,
      ) => [
          {
            title: t("table.bookingId"),
            dataIndex: "bookingNumber",
            key: "bookingNumber",
            width: 120,
            render: (bookingNumber, record) => (
              <>
                {getSafeValue(bookingNumber)}
                {record?.subscription && (
                  <RecurringIndicator
                    interval={record.subscription?.recurringIntervalType}
                  />
                )}
              </>
            ),
          },
          {
            title: t("table.customer"),
            key: "customer",
            width: 180,
            render: (_, record) => (
              <div className={styles.nameCell}>
                <span className={styles.customerName}>
                  {`${record?.contactFirstName || ""} ${record?.contactLastName || ""}`.trim() ||
                    "-"}
                </span>
                <span className={styles.customerEmail}>
                  {getSafeValue(record?.contactEmail)}
                </span>
              </div>
            ),
          },
          {
            title: t("table.service"),
            dataIndex: "service",
            key: "service",
            width: 120,
            render: (service) => service?.name || "-",
          },
          {
            title: t("table.extraServices") || "Extra Services",
            dataIndex: "bookingExtraServices",
            key: "extraServices",
            width: 150,
            render: (services) => {
              if (!services || !services.length) return "-";
              const names = services
                .map((s) => s.extraService?.name)
                .filter(Boolean);
              if (!names.length) return "-";

              return (
                <Tooltip title={names.join(", ")}>
                  <div className={styles.extraServicesCell}>
                    {names.slice(0, 1).map((name, idx) => (
                      <Tag key={idx} color="cyan" style={{ margin: 0 }}>
                        {name}
                      </Tag>
                    ))}
                    {names.length > 1 && (
                      <Tag color="cyan" style={{ margin: 0 }}>
                        +{names.length - 1}
                      </Tag>
                    )}
                  </div>
                </Tooltip>
              );
            },
          },
          {
            title: t("table.area"),
            dataIndex: "areaSqm",
            key: "area",
            width: 80,
            align: "center",
            render: (area) => formatArea(area),
          },
          {
            title: t("table.price"),
            dataIndex: "totalAmount",
            key: "price",
            width: 100,
            render: (amount) => formatCurrency(amount),
          },
          {
            title: t("table.date"),
            dataIndex: "bookingDate",
            key: "date",
            width: 120,
            render: (date) => formatDate(date),
          },
          // {
          //   title: t("table.time"),
          //   dataIndex: "startTime",
          //   key: "time",
          //   width: 100,
          //   render: (time) => formatTime(time),
          // },
          {
            title: t("table.status"),
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status) => (
              <StatusBadge status={formatBookingStatus(status)} />
            ),
          },
          {
            title: t("table.adminNotes") || "Admin Notes",
            dataIndex: "adminNotes",
            key: "adminNotes",
            width: 100,
            align: "center",
            render: (notes) =>
              notes ? (
                <Tooltip title={notes}>
                  <Tag
                    color="red"
                    icon={<FileTextOutlined />}
                    style={{ cursor: "pointer", margin: 0 }}
                  >
                    Note
                  </Tag>
                </Tooltip>
              ) : (
                "-"
              ),
          },
          {
            title: t("table.actions"),
            key: "actions",
            width: 80,
            align: "center",
            render: (_, record) => (
              <ActionMenu
                onAction={handleRowAction}
                record={record}
                items={[
                  { key: "view", label: t("common.view") },
                  ...(showEdit ? [{ key: "edit", label: t("common.edit") }] : []),
                  ...(showDelete
                    ? [{ key: "delete", label: t("common.delete") }]
                    : []),
                ]}
              />
            ),
          },
        ],
    [t],
  );

  const getServicesColumns = useMemo(
    () =>
      (
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatCurrency,
        canUpdate = false,
        canDelete = false,
      ) => [
        {
          title: t("table.serviceId"),
          dataIndex: "id",
          key: "id",
          width: 80,
        },
        {
          title: t("table.serviceName"),
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: t("table.description"),
          dataIndex: "description",
          key: "description",
          width: 300,
          ellipsis: true,
        },
        {
          title: t("table.price"),
          key: "price",
          width: 120,
          render: (_, record) => {
            const pricingRules = record?.pricingRules || [];
            const baseRule =
              pricingRules.find((rule) => rule.ruleType === "BASE") ||
              pricingRules[0];
            return baseRule ? formatCurrency(baseRule.price) : "-";
          },
        },
        {
          title: t("table.status"),
          dataIndex: "isActive",
          key: "status",
          width: 100,
          render: (isActive) => (
            <StatusBadge status={isActive ? "active" : "inactive"} />
          ),
        },
        {
          title: t("table.actions"),
          key: "actions",
          width: 80,
          align: "center",
          render: (_, record) => (
            <ActionMenu
              onAction={handleRowAction}
              record={record}
              items={[
                { key: "view", label: t("common.view") },
                ...(canUpdate ? [{ key: "edit", label: t("common.edit") }] : []),
                ...(canDelete
                  ? [{ key: "delete", label: t("common.delete") }]
                  : []),
              ]}
            />
          ),
        },
      ],
    [t],
  );

  const getDiscountCodesColumns = useMemo(
    () =>
      (
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatDate,
        canUpdate = false,
        canDelete = false,
      ) => [
        {
          title: t("table.code"),
          dataIndex: "code",
          key: "code",
          width: 150,
        },
        {
          title: t("table.discount"),
          dataIndex: "discountValue",
          key: "discount",
          width: 120,
          render: (value, record) =>
            record.discountType === "PERCENTAGE" ? `${value}%` : `${value} NOK`,
        },
        {
          title: t("table.validFrom"),
          dataIndex: "validFrom",
          key: "validFrom",
          width: 140,
          render: (date) => formatDate(date),
        },
        {
          title: t("table.validTo"),
          dataIndex: "validUntil",
          key: "validTo",
          width: 140,
          render: (date) => formatDate(date),
        },
        {
          title: t("table.status"),
          dataIndex: "isActive",
          key: "status",
          width: 100,
          render: (isActive) => (
            <StatusBadge status={isActive ? "active" : "inactive"} />
          ),
        },
        {
          title: t("table.actions"),
          key: "actions",
          width: 80,
          align: "center",
          render: (_, record) => (
            <ActionMenu
              onAction={handleRowAction}
              record={record}
              items={[
                { key: "view", label: t("common.view") },
                ...(canUpdate ? [{ key: "edit", label: t("common.edit") }] : []),
                ...(canDelete
                  ? [{ key: "delete", label: t("common.delete") }]
                  : []),
              ]}
            />
          ),
        },
      ],
    [t],
  );

  const getAdditionalServicesColumns = useMemo(
    () =>
      (
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatCurrency,
        canUpdate = false,
        canDelete = false,
      ) => [
        {
          title: t("table.serviceId"),
          dataIndex: "id",
          key: "id",
          width: 80,
        },
        {
          title: t("table.serviceName"),
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: t("table.description"),
          dataIndex: "description",
          key: "description",
          width: 300,
          ellipsis: true,
        },
        {
          title: t("table.price"),
          dataIndex: "price",
          key: "price",
          width: 120,
          render: (price) => formatCurrency(price),
        },
        {
          title: t("table.status"),
          dataIndex: "isActive",
          key: "status",
          width: 100,
          render: (isActive) => (
            <StatusBadge status={isActive ? "active" : "inactive"} />
          ),
        },
        {
          title: t("table.actions"),
          key: "actions",
          width: 80,
          align: "center",
          render: (_, record) => (
            <ActionMenu
              onAction={handleRowAction}
              record={record}
              items={[
                { key: "view", label: t("common.view") },
                ...(canUpdate ? [{ key: "edit", label: t("common.edit") }] : []),
                ...(canDelete
                  ? [{ key: "delete", label: t("common.delete") }]
                  : []),
              ]}
            />
          ),
        },
      ],
    [t],
  );

  const getSpecialOffersColumns = useMemo(
    () =>
      (
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatDate,
        canUpdate = false,
        canDelete = false,
      ) => [
          {
            title: t("table.offerId"),
            dataIndex: "id",
            key: "id",
            width: 80,
          },
          {
            title: t("table.offerName"),
            dataIndex: "name",
            key: "name",
            width: 200,
            render: (name, record) => (
              <div className={styles.nameCell}>
                <span className={styles.offerName}>{name}</span>
                <span className={styles.offerDescription}>
                  {record.description}
                </span>
              </div>
            ),
          },
          {
            title: t("table.discountType"),
            dataIndex: "discountType",
            key: "discountType",
            width: 120,
            render: (type) => (type === "PERCENTAGE" ? "Percentage" : "Fixed"),
          },
          {
            title: t("table.discount"),
            dataIndex: "discountValue",
            key: "discount",
            width: 120,
            render: (value, record) =>
              record.discountType === "PERCENTAGE" ? `${value}%` : `${value} NOK`,
          },
          {
            title: t("table.validFrom"),
            dataIndex: "validFrom",
            key: "validFrom",
            width: 140,
            render: (date) => formatDate(date),
          },
          {
            title: t("table.validTo"),
            dataIndex: "validTo",
            key: "validTo",
            width: 140,
            render: (date) => formatDate(date),
          },
          {
            title: t("table.status"),
            dataIndex: "isActive",
            key: "status",
            width: 100,
            render: (isActive) => (
              <StatusBadge status={isActive ? "active" : "inactive"} />
            ),
          },
        {
          title: t("table.actions"),
          key: "actions",
          width: 80,
          align: "center",
          render: (_, record) => (
            <ActionMenu
              onAction={handleRowAction}
              record={record}
              items={[
                { key: "view", label: t("common.view") },
                ...(canUpdate ? [{ key: "edit", label: t("common.edit") }] : []),
                ...(canDelete
                  ? [{ key: "delete", label: t("common.delete") }]
                  : []),
              ]}
            />
          ),
        },
        ],
    [t],
  );

  const getPricingRulesColumns = useMemo(
    () =>
      (
        handleRowAction,
        styles,
        ActionMenu,
        formatCurrency,
        canUpdate = false,
        canDelete = false,
      ) => {
        const columns = [
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
          },
        ];

        columns.push({
          title: t("table.name"),
          dataIndex: "name",
          key: "name",
          width: 180,
          render: (name) => name || "-",
        });

        columns.push(
          {
            title: t("pages.pricingRules.fields.ruleType"),
            dataIndex: "ruleType",
            key: "ruleType",
            width: 120,
            render: (type) => {
              const className =
                type === "BASE"
                  ? styles.ruleTypeBase
                  : styles.ruleTypeStep;
              const label =
                type === "BASE"
                  ? t("pages.pricingRules.fields.typeBase")
                  : t("pages.pricingRules.fields.typeStep");
              return (
                <span
                  className={`${styles.ruleTypeTag} ${className}`}
                >
                  {label}
                </span>
              );
            },
          },
          {
            title: t("pages.pricingRules.fields.serviceType"),
            dataIndex: "serviceType",
            key: "serviceType",
            width: 140,
            render: (type) => {
              if (!type) return "-";
              const className =
                type === "ONE_TIME"
                  ? styles.serviceTypeOneTime
                  : styles.serviceTypeRecurring;
              const label =
                type === "ONE_TIME"
                  ? t("pages.pricingRules.fields.oneTime")
                  : t("pages.pricingRules.fields.recurring");
              return (
                <span
                  className={`${styles.serviceTypeTag} ${className}`}
                >
                  {label}
                </span>
              );
            },
          },
          {
            title: t("pages.pricingRules.fields.maxAreaLimitShort"),
            dataIndex: "maxAreaLimit",
            key: "maxAreaLimit",
            width: 120,
            align: "center",
            render: (val) =>
              val !== null && val !== undefined ? `${val} m²` : "-",
          },
          {
            title: t("table.price"),
            dataIndex: "price",
            key: "price",
            width: 120,
            render: (price) => formatCurrency(price),
          },
          {
            title: t("pages.pricingRules.fields.stepSize"),
            dataIndex: "stepSize",
            key: "stepSize",
            width: 100,
            align: "center",
            render: (val) =>
              val !== null && val !== undefined ? val : "-",
          },
          {
            title: t("pages.pricingRules.fields.childRules"),
            dataIndex: "childRules",
            key: "childRules",
            width: 100,
            align: "center",
            render: (childRules) => (
              <span className={styles.childRulesCount}>
                {Array.isArray(childRules) ? childRules.length : 0}
              </span>
            ),
          },
          {
            title: t("table.actions"),
            key: "actions",
            width: 80,
            align: "center",
            render: (_, record) => (
              <ActionMenu
                onAction={handleRowAction}
                record={record}
                items={[
                  { key: "view", label: t("common.view") },
                  ...(canUpdate
                    ? [{ key: "edit", label: t("common.edit") }]
                    : []),
                  ...(canDelete
                    ? [{ key: "delete", label: t("common.delete") }]
                    : []),
                ]}
              />
            ),
          },
        );

        return columns;
      },
    [t],
  );
  const getSubscriptionsColumns = useMemo(
    () =>
      (
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatDate,
        formatCurrency,
        canUpdate = false,
      ) => [
        {
          title: t("table.subscriptionId"),
          dataIndex: "id",
          key: "id",
          width: 100,
        },
        {
          title: t("table.status"),
          dataIndex: "status",
          key: "status",
          width: 120,
          render: (status) => {
            const statusMap = {
              ACTIVE: "paid",
              PENDING: "unpaid",
              CANCELLED: "cancelled",
              EXPIRED: "expired",
            };
            return <StatusBadge status={statusMap[status] || "unpaid"} />;
          },
        },
        {
          title: t("table.contactName"),
          key: "contactName",
          width: 180,
          render: (_, record) => {
            const first = record?.contactFirstName || "";
            const last = record?.contactLastName || "";
            const full = `${first} ${last}`.trim();
            return full || "-";
          },
        },
        {
          title: t("table.email"),
          dataIndex: "contactEmail",
          key: "contactEmail",
          width: 200,
        },
        {
          title: t("table.recurringInterval"),
          dataIndex: "recurringIntervalType",
          key: "recurringIntervalType",
          width: 140,
          render: (type) => {
            const classMap = {
              WEEKLY: styles.intervalWeekly,
              EVERY_SECOND_WEEK: styles.intervalBiweekly,
              EVERY_THIRD_WEEK: styles.intervalTriweekly,
              MONTHLY: styles.intervalMonthly,
            };
            const labelMap = {
              WEEKLY: t("table.intervalWeekly"),
              EVERY_SECOND_WEEK: t("table.intervalEverySecondWeek"),
              EVERY_THIRD_WEEK: t("table.intervalEveryThirdWeek"),
              MONTHLY: t("table.intervalMonthly"),
            };
            return (
              <span
                className={`${styles.intervalTag} ${classMap[type] || ""}`}
              >
                {labelMap[type] || type || "-"}
              </span>
            );
          },
        },
        {
          title: t("table.nextScheduledDate"),
          dataIndex: "nextScheduledDate",
          key: "nextScheduledDate",
          width: 180,
          render: (date, record) => {
            const formattedDate =
              typeof date === "string" ? date.split("T")[0] : "-";
            const expectedPrice = record?.futureBookingExpectedPrice;

            if (expectedPrice && record?.status !== "PENDING") {
              return (
                <Tooltip
                  title={t("pages.subscriptions.expectedPrice").replace(
                    "{price}",
                    formatCurrency(expectedPrice),
                  )}
                >
                  <span style={{ borderBottom: "1px dotted #ccc" }}>
                    {formattedDate}
                  </span>
                </Tooltip>
              );
            }
            return formattedDate;
          },
        },
        {
          title: t("table.nextInvoicingDate"),
          dataIndex: "nextInvoicingDate",
          key: "nextInvoicingDate",
          width: 180,
          render: (date) =>
            typeof date === "string" ? date.split("T")[0] : "-",
        },
        {
          title: t("table.date"),
          dataIndex: "createdAt",
          key: "createdAt",
          width: 140,
          render: (date) => formatDate(date),
        },
        {
          title: t("table.actions"),
          key: "actions",
          width: 80,
          align: "center",
          render: (_, record) => (
            <div onClick={(e) => e.stopPropagation()}>
              <ActionMenu
                onAction={handleRowAction}
                record={record}
                items={[
                  { key: "view", label: t("common.view") },
                  ...(canUpdate && record.status !== "CANCELLED"
                    ? [{ key: "edit", label: t("common.edit") }]
                    : []),
                ]}
              />
            </div>
          ),
        },
      ],
    [t],
  );

  const getSubscriptionBookingsColumns = useMemo(
    () =>
      (
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatArea,
        formatCurrency,
        formatDate,
        formatTime,
        formatBookingStatus,
        firstBookingId,
        canUpdate = false,
      ) => [
          {
            title: t("table.bookingId"),
            dataIndex: "bookingNumber",
            key: "bookingNumber",
            width: 120,
            render: (bookingNumber, record) => (
              <>
                {getSafeValue(bookingNumber)}
                {record?.subscription && (
                  <RecurringIndicator
                    interval={record.subscription?.recurringIntervalType}
                  />
                )}
              </>
            ),
          },
          {
            title: t("table.customer"),
            key: "customer",
            width: 180,
            render: (_, record) => (
              <div className={styles.nameCell}>
                <span className={styles.customerName}>
                  {`${record?.contactFirstName || ""} ${record?.contactLastName || ""}`.trim() ||
                    "-"}
                </span>
                <span className={styles.customerEmail}>
                  {getSafeValue(record?.contactEmail)}
                </span>
              </div>
            ),
          },
          {
            title: t("table.service"),
            dataIndex: "service",
            key: "service",
            width: 120,
            render: (service) => service?.name || "-",
          },
          {
            title: t("table.extraServices") || "Extra Services",
            dataIndex: "bookingExtraServices",
            key: "extraServices",
            width: 150,
            render: (services) => {
              if (!services || !services.length) return "-";
              const names = services
                .map((s) => s.extraService?.name)
                .filter(Boolean);
              if (!names.length) return "-";

              return (
                <Tooltip title={names.join(", ")}>
                  <div className={styles.extraServicesCell}>
                    {names.slice(0, 1).map((name, idx) => (
                      <Tag key={idx} color="cyan" style={{ margin: 0 }}>
                        {name}
                      </Tag>
                    ))}
                    {names.length > 1 && (
                      <Tag color="cyan" style={{ margin: 0 }}>
                        +{names.length - 1}
                      </Tag>
                    )}
                  </div>
                </Tooltip>
              );
            },
          },
          {
            title: t("table.area"),
            dataIndex: "areaSqm",
            key: "area",
            width: 80,
            align: "center",
            render: (area) => formatArea(area),
          },
          {
            title: t("table.price"),
            dataIndex: "totalAmount",
            key: "price",
            width: 100,
            render: (amount) => formatCurrency(amount),
          },
          {
            title: t("table.date"),
            dataIndex: "bookingDate",
            key: "date",
            width: 120,
            render: (date) => formatDate(date),
          },
          // {
          //   title: t("table.time"),
          //   dataIndex: "startTime",
          //   key: "time",
          //   width: 100,
          //   render: (time) => formatTime(time),
          // },
          {
            title: t("table.status"),
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status) => (
              <StatusBadge status={formatBookingStatus(status)} />
            ),
          },
          {
            title: t("table.adminNotes") || "Admin Notes",
            dataIndex: "adminNotes",
            key: "adminNotes",
            width: 100,
            align: "center",
            render: (notes) =>
              notes ? (
                <Tooltip title={notes}>
                  <Tag
                    color="red"
                    icon={<FileTextOutlined />}
                    style={{ cursor: "pointer", margin: 0 }}
                  >
                    Note
                  </Tag>
                </Tooltip>
              ) : (
                "-"
              ),
          },
          {
            title: t("table.actions"),
            key: "actions",
            width: 80,
            align: "center",
            render: (_, record) => {
              const isFirst = record.id === firstBookingId;
              const isConfirmed = record.status === "CONFIRMED";
              return (
                <div onClick={(e) => e.stopPropagation()}>
                  <ActionMenu
                    onAction={handleRowAction}
                    record={record}
                    items={[
                      { key: "view", label: t("common.view") },
                      ...(canUpdate && isFirst
                        ? [{ key: "edit", label: t("common.edit") }]
                        : []),
                    ]}
                  />
                </div>
              );
            },
          },
        ],
    [t],
  );

  const getPaymentsColumns = useMemo(
    () => (handleRowAction, styles, StatusBadge, ActionMenu, formatDate, formatCurrency) => [
      {
        title: t("table.paymentId"),
        dataIndex: "id",
        key: "id",
        width: 100,
      },
      {
        title: t("table.bookingNumber"),
        dataIndex: "bookingnumber",
        key: "bookingnumber",
        width: 140,
      },
      {
        title: t("table.contactName"),
        key: "contactname",
        width: 180,
        render: (_, record) => {
          const first = record?.contactfirstname || "";
          const last = record?.contactlastname || "";
          const full = `${first} ${last}`.trim();
          return full || "-";
        },
      },
      {
        title: t("table.contactEmail"),
        dataIndex: "contactemail",
        key: "contactemail",
        width: 180,
      },
      {
        title: t("table.amount"),
        dataIndex: "amount",
        key: "amount",
        width: 120,
        render: (amount) => formatCurrency(amount),
      },
      {
        title: t("table.paymentMethod"),
        dataIndex: "paymentmethod",
        key: "paymentmethod",
        width: 140,
        render: (method) => (
          <span className={styles.paymentMethodTag}>
            {method || "-"}
          </span>
        ),
      },
      {
        title: t("table.transactionId"),
        dataIndex: "transactionid",
        key: "transactionid",
        width: 200,
        ellipsis: true,
        render: (id) => id || "-",
      },
      {
        title: t("table.status"),
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status) => {
          const statusMap = {
            PAID: "paid",
            PENDING: "pending",
            FAILED: "failed",
          };
          return <StatusBadge status={statusMap[status] || "pending"} />;
        },
      },
      {
        title: t("table.paidAt"),
        dataIndex: "paidat",
        key: "paidat",
        width: 160,
        render: (date) => (date ? formatDate(date) : "-"),
      },
      {
        title: t("table.createdAt"),
        dataIndex: "createdat",
        key: "createdat",
        width: 160,
        render: (date) => formatDate(date),
      },
      {
        title: t("table.actions"),
        key: "actions",
        width: 80,
        align: "center",
        render: (_, record) => (
          <div onClick={(e) => e.stopPropagation()}>
            <ActionMenu
              onAction={handleRowAction}
              record={record}
              items={[{ key: "view", label: t("common.view") }]}
            />
          </div>
        ),
      },
    ],
    [t],
  );

  const getRolesColumns = useMemo(
    () => (handleRowAction, styles, ActionMenu, canUpdate = false, canDelete = false) => [
      {
        title: t("pages.roles.id") || "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
      },
      {
        title: t("pages.roles.roleName") || "Role Name",
        dataIndex: "name",
        key: "name",
        render: (text) => (
          <span style={{ fontWeight: 500 }}>{text || "-"}</span>
        ),
      },
      {
        title: t("pages.roles.permissionsCount") || "Permissions",
        key: "permissionsCount",
        width: 120,
        render: (_, record) => {
          const count = record?.rolePermission?.length || 0;
          return (
            <span className={styles.permissionCount}>
              {count}
            </span>
          );
        },
      },
      {
        title: t("pages.roles.createdAt") || "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 160,
        render: (text) => {
          if (!text) return "-";
          return new Date(text).toLocaleDateString();
        },
      },
      {
        title: t("table.actions"),
        key: "actions",
        width: 80,
        align: "center",
        render: (_, record) => (
          <ActionMenu
            onAction={handleRowAction}
            record={record}
            items={[
              { key: "view", label: t("common.view") },
              ...(canUpdate ? [{ key: "edit", label: t("common.edit") }] : []),
              ...(canDelete
                ? [{ key: "delete", label: t("common.delete") }]
                : []),
            ]}
          />
        ),
      },
    ],
    [t],
  );

  const getUserRolesColumns = useMemo(
    () =>
      (
        handleRowAction,
        styles,
        ActionMenu,
        Tag,
        canUpdate = false,
        canDelete = false,
      ) => [
      {
        title: t("pages.userRoles.name") || "Name",
        key: "name",
        render: (_, record) => {
          const name = `${record.firstName || ""} ${record.lastName || ""}`.trim();
          return (
            <span style={{ fontWeight: 500 }}>
              {name || "-"}
            </span>
          );
        },
      },
      {
        title: t("pages.userRoles.email") || "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: t("pages.userRoles.roles") || "Role(s)",
        key: "roles",
        render: (_, record) => {
          const userRoles = record.userRolePermission
            ? record.userRolePermission
                .filter((urp) => urp.role)
                .map((urp) => urp.role)
            : [];
          if (userRoles.length === 0) {
            return (
              <Tag color="default">
                {t("pages.userRoles.noRoles") || "No roles"}
              </Tag>
            );
          }
          return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {userRoles.map((role) => (
                <Tag key={role.id} color="green">
                  {role.name}
                </Tag>
              ))}
            </div>
          );
        },
      },
      {
        title: t("table.actions"),
        key: "actions",
        width: 80,
        align: "center",
        render: (_, record) => (
          <ActionMenu
            onAction={handleRowAction}
            record={record}
            items={[
              { key: "view", label: t("common.view") },
              ...(canUpdate ? [{ key: "edit", label: t("common.edit") }] : []),
              ...(canDelete
                ? [{ key: "delete", label: t("common.delete") }]
                : []),
            ]}
          />
        ),
      },
    ],
    [t],
  );


  return {
    getCustomersColumns,
    getBookingsColumns,
    getServicesColumns,
    getDiscountCodesColumns,
    getAdditionalServicesColumns,
    getSpecialOffersColumns,
    getPricingRulesColumns,
    getSubscriptionsColumns,
    getSubscriptionBookingsColumns,
    getPaymentsColumns,
    getRolesColumns,
    getUserRolesColumns,
  };
};

export default useTableColumns;
