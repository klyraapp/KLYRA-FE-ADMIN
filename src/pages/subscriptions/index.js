/**
 * Subscriptions Page
 * Displays all subscriptions with filters and actions
 * Click on a row to navigate to the subscription detail (bookings)
 */

import ActionMenu from "@/components/ActionMenu/ActionMenu";
import AntTable from "@/components/AntTable/AntTable";
import DetailModal from "@/components/common/DetailModal";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
// import StripeCardUpdate from "@/components/common/StripeCardUpdate/StripeCardUpdate";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import PageHeader from "@/components/PageHeader/PageHeader";
import PageGuard from "@/components/common/RBAC/PageGuard";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { useDisabledDates } from "@/hooks/useBookings";
import {
  useSubscriptions,
  useUpdateSubscription,
} from "@/hooks/useSubscriptions";
import usePermission from "@/hooks/usePermission";
import useTableColumns from "@/hooks/useTableColumns";
import { useTranslation } from "@/hooks/useTranslation";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import styles from "@/styles/subscriptions.module.css";
import {
  ALLOWED_SUBSCRIPTION_STATUS_TRANSITIONS
} from "@/utils/bookingConstants";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { getSafeValue } from "@/utils/safeRendering";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";

const SubscriptionsPage = () => {
  const { t } = useTranslation();
  const { can } = usePermission();

  const [modalState, setModalState] = useState({
    type: null,
    data: null,
    open: false,
  });

  const SUBSCRIPTION_FIELDS = useMemo(() => [
    { name: "id", label: t("table.subscriptionId") },
    {
      name: "contactName",
      label: t("table.contactName"),
      render: (_, record) => {
        const first = record?.contactFirstName || "";
        const last = record?.contactLastName || "";
        const full = `${first} ${last}`.trim();
        return full || "-";
      },
    },
    { name: "contactEmail", label: t("table.contactEmail") },
    {
      name: "status",
      label: t("table.status"),
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
    { name: "recurringIntervalType", label: t("table.recurringInterval") },
    {
      name: "nextScheduledDate",
      label: t("table.nextScheduledDate"),
      render: (date) => (typeof date === "string" ? date.split("T")[0] : "-"),
    },
    {
      name: "nextInvoicingDate",
      label: t("table.nextInvoicingDate"),
      render: (date) => (typeof date === "string" ? date.split("T")[0] : "-"),
    },
    { name: "createdAt", label: t("table.createdAt"), fullWidth: true },
    { name: "updatedAt", label: t("table.updatedAt"), fullWidth: true },
  ], [t]);

  const SUBSCRIPTION_STATUS_OPTIONS = useMemo(() => [
    { value: "all", label: t("filters.statusAll") },
    { value: "ACTIVE", label: t("status.paid") },
    { value: "PENDING", label: t("status.unpaid") },
    { value: "EXPIRED", label: t("status.expired") },
    { value: "CANCELLED", label: t("status.cancelled") },
  ], [t]);

  const editingServiceId =
    modalState.type === "edit"
      ? modalState.data?.serviceId || modalState.data?.service?.id
      : null;
  const { data: disabledData } = useDisabledDates(editingServiceId);

  const disabledDate = useCallback((current) => {
    if (!current) return false;
    const isPast = current.isBefore(dayjs(), "day");
    if (!disabledData) return isPast;
    const dateStr = current.format("YYYY-MM-DD");
    const isSelectedDisabled = disabledData.disabledDates?.includes(dateStr);
    const isSunday = disabledData.sundayOff && current.day() === 0;
    const isSaturday = disabledData.saturdayOff && current.day() === 6;
    return isPast || isSelectedDisabled || isSunday || isSaturday;
  }, [disabledData]);

  const router = useRouter();
  const { getSubscriptionsColumns } = useTableColumns();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });

  const queryParams = useMemo(() => {
    const params = {
      take: pagination.take,
      skip: pagination.skip,
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    return params;
  }, [searchTerm, pagination]);

  const { data: subscriptionsResponse, isLoading } = useSubscriptions(queryParams);

  const subscriptions = useMemo(() => {
    const list = subscriptionsResponse?.subscriptions || [];
    if (statusFilter && statusFilter !== "all") {
      return list.filter(
        (sub) => sub.status === statusFilter.toUpperCase(),
      );
    }
    return list;
  }, [subscriptionsResponse, statusFilter]);

  const totalCount = subscriptionsResponse?.totalCount || 0;
  const { mutate: updateSubscription, isPending: isUpdating } = useUpdateSubscription();
  // const { mutate: updatePaymentMethod, isPending: isUpdatingCard } = useUpdateSubscriptionPaymentMethod();

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data, open: true });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null, open: false });
  }, []);

  const handleCardUpdate = useCallback(
    (paymentMethodId) => {
      /*
      if (modalState.data?.id) {
        updatePaymentMethod(
          { id: modalState.data.id, paymentMethodId },
          { onSuccess: closeModal },
        );
      }
      */
    },
    [modalState.data?.id, /* updatePaymentMethod, */ closeModal],
  );

  const statusOptions = useMemo(() => {
    const currentStatus = modalState.data?.status;
    if (!currentStatus) return [];

    const allowedTransitions = ALLOWED_SUBSCRIPTION_STATUS_TRANSITIONS[currentStatus] || [];
    return SUBSCRIPTION_STATUS_OPTIONS.filter(
      (opt) => opt.value === currentStatus || allowedTransitions.includes(opt.value)
    );
  }, [modalState.data?.status, SUBSCRIPTION_STATUS_OPTIONS]);

  const editFields = useMemo(
    () => [
      {
        name: "nextScheduledDate",
        label: t("table.nextScheduledDate"),
        type: "date",
        rules: [],
        disabledDate,
      },
      {
        name: "status",
        label: t("table.status"),
        type: "select",
        options: statusOptions,
        rules: [{ required: true, message: t("table.status") }],
      },
    ],
    [t, statusOptions, disabledDate],
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }, []);

  const handlePageChange = useCallback((page, pageSize) => {
    const skip = (page - 1) * pageSize;
    setPagination({ skip, take: pageSize });
  }, []);

  const handleRowAction = useCallback(
    (action, record) => {
      if (action === "view") {
        router.push(`/subscriptions/${record.id}`);
      } else if (action === "edit") {
        openModal("edit", record);
      }
    },
    [openModal, router],
  );

  const handleUpdate = useCallback(
    (values) => {
      if (modalState.data?.id) {
        const payload = {};
        const originalData = modalState.data;

        // Only send changed fields
        Object.keys(values).forEach((key) => {
          if (key === "nextScheduledDate") {
            const originalDateStr = originalData.nextScheduledDate;
            const newDate = values.nextScheduledDate;

            // Simple check if date part changed
            const originalDatePart = typeof originalDateStr === "string" ? originalDateStr.split("T")[0] : null;
            const newDatePart = newDate ? newDate.format("YYYY-MM-DD") : null;

            if (originalDatePart !== newDatePart) {
              if (newDate && typeof originalDateStr === "string" && originalDateStr.includes("T")) {
                const timePart = originalDateStr.split("T")[1];
                payload.nextScheduledDate = `${newDatePart}T${timePart}`;
              } else {
                payload.nextScheduledDate = newDate ? newDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") : null;
              }
            }
          } else if (values[key] !== originalData[key]) {
            payload[key] = values[key];
          }
        });

        if (Object.keys(payload).length > 0) {
          updateSubscription(
            { id: modalState.data.id, data: payload },
            { onSuccess: closeModal },
          );
        } else {
          closeModal();
        }
      }
    },
    [modalState.data, updateSubscription, closeModal],
  );

  const handleRowClick = useCallback(
    (record) => {
      router.push(`/subscriptions/${record.id}`);
    },
    [router],
  );

  const columns = useMemo(
    () =>
      getSubscriptionsColumns(
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatDate,
        formatCurrency,
        can(PERMISSION_KEYS.SUBSCRIPTION_UPDATE),
      ),
    [getSubscriptionsColumns, handleRowAction, can],
  );

  return (
    <PageGuard permission={PERMISSION_KEYS.SUBSCRIPTION_READ}>
      <div className={styles.pageContainer}>
        <PageHeader
          titleKey="pages.subscriptions.title"
          subtitleKey="pages.subscriptions.subtitle"
        />

        <FiltersBar
          onStatusChange={handleStatusChange}
          showStatusFilter={false}
          showDateFilter={false}
          showSearch={false}
        />

        <ErrorBoundary>
          <AntTable
            columns={columns}
            dataSource={subscriptions}
            rowKey="id"
            showPagination
            defaultPageSize={10}
            loading={isLoading}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            })}
            pagination={{
              current: Math.floor(pagination.skip / pagination.take) + 1,
              pageSize: pagination.take,
              total: totalCount,
            }}
            onChange={(paginationConfig) => {
              if (paginationConfig?.current && paginationConfig?.pageSize) {
                handlePageChange(
                  paginationConfig.current,
                  paginationConfig.pageSize,
                );
              }
            }}
          />
        </ErrorBoundary>

        <DetailModal
          open={modalState.open && modalState.type === "view"}
          onClose={closeModal}
          title={t("pages.subscriptions.subscription")}
          data={modalState.data}
          fields={SUBSCRIPTION_FIELDS}
          mode="view"
        />

        <DetailModal
          open={modalState.open && modalState.type === "edit"}
          onClose={closeModal}
          onSave={handleUpdate}
          title={t("pages.subscriptions.subscription")}
          data={modalState.data}
          fields={editFields}
          mode="edit"
          loading={isUpdating}
        >
          {/* 
          <StripeCardUpdate
            key={modalState.open ? `open-${modalState.data?.id}` : 'closed'}
            onUpdate={handleCardUpdate}
            loading={isUpdatingCard}
          />
          */}
        </DetailModal>
      </div>
    </PageGuard>
  );
};

export default SubscriptionsPage;
