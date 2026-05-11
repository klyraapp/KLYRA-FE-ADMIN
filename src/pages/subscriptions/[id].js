/**
 * Subscription Detail Page
 * Shows all bookings for a specific subscription (Master → Detail)
 * First booking is highlighted and gets an edit action; others are view-only
 */

import ActionMenu from "@/components/ActionMenu/ActionMenu";
import AntTable from "@/components/AntTable/AntTable";
import DetailModal from "@/components/common/DetailModal";
import DetailSection from "@/components/common/DetailSection";
import { createSubscriptionSections, createBookingExtraServicesSections } from "@/components/common/DetailSection/sectionHelpers";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import ViewToggle, { VIEW_LIST, VIEW_CALENDAR } from "@/components/common/ViewToggle";
import BookingsCalendar from "@/components/common/BookingsCalendar";
import { Pagination } from "antd";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import PageHeader from "@/components/PageHeader/PageHeader";
import PageGuard from "@/components/common/RBAC/PageGuard";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { useBookings, useCalendarBookings, useDisabledDates, useUpdateBooking } from "@/hooks/useBookings";
import usePermission from "@/hooks/usePermission";
import useTableColumns from "@/hooks/useTableColumns";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/subscriptions.module.css";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import {
  ALLOWED_STATUS_TRANSITIONS,
  BookingStatus,
} from "@/utils/bookingConstants";
import {
  formatArea,
  formatBookingStatus,
  formatCurrency,
  formatDate,
  formatTime,
} from "@/utils/formatters";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";

const SubscriptionDetailPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const subscriptionId = id ? Number(id) : null;

  const BOOKING_FIELDS = useMemo(
    () => [
      { name: "bookingNumber", label: t("pages.bookings.fields.bookingNumber") },
      { name: "status", label: t("pages.bookings.fields.status") },
      { name: "paymentStatus", label: t("pages.bookings.fields.paymentStatus") },
      { name: "contactFirstName", label: t("pages.bookings.fields.firstName") },
      { name: "contactLastName", label: t("pages.bookings.fields.lastName") },
      { name: "contactEmail", label: t("pages.bookings.fields.email") },
      { name: "contactPhone", label: t("pages.bookings.fields.phone") },
      { name: ["service", "name"], label: t("pages.bookings.fields.service") },
      {
        name: "accommodationType",
        label: t("pages.bookings.fields.accommodationType"),
      },
      {
        name: "numberOfBathrooms",
        label: t("pages.bookings.fields.numberOfBathrooms"),
      },
      { name: "areaSqm", label: t("pages.bookings.fields.areaSqm") },
      { name: "areaSqft", label: t("pages.bookings.fields.areaSqft") },
      { name: "bookingDate", label: t("pages.bookings.fields.bookingDate") },
      // { name: "startTime", label: t("pages.bookings.fields.startTime") },
      {
        name: "serviceStreetAddress",
        label: t("pages.bookings.fields.streetAddress"),
        fullWidth: true,
      },
      { name: "serviceCity", label: t("pages.bookings.fields.city") },
      {
        name: "servicePostalCode",
        label: t("pages.bookings.fields.postalCode"),
      },
      { name: "serviceCountry", label: t("pages.bookings.fields.country") },
      {
        name: "hasFreeParking",
        label: t("pages.bookings.fields.freeParking"),
        type: "boolean",
      },
      {
        name: "parkingSurcharge",
        label: t("pages.bookings.fields.parkingSurcharge"),
      },
      {
        name: "hasPets",
        label: t("pages.bookings.fields.hasPets"),
        type: "boolean",
      },
      {
        name: "petSurcharge",
        label: t("pages.bookings.fields.petSurcharge"),
      },
      { name: "accessMethod", label: t("pages.bookings.fields.accessMethod") },
      { name: "subtotal", label: t("pages.bookings.fields.subtotal") },
      { name: "taxRate", label: t("pages.bookings.fields.taxRate") },
      { name: "taxAmount", label: t("pages.bookings.fields.taxAmount") },
      {
        name: "discountAmount",
        label: t("pages.bookings.fields.discountAmount"),
      },
      { name: "totalAmount", label: t("pages.bookings.fields.totalAmount") },
      {
        name: "specialInstructions",
        label: t("pages.bookings.fields.specialInstructions"),
        type: "textarea",
        fullWidth: true,
      },
      {
        name: "createdAt",
        label: t("pages.bookings.fields.createdAt"),
        fullWidth: true,
      },
      {
        name: "updatedAt",
        label: t("pages.bookings.fields.updatedAt"),
        fullWidth: true,
      },
      {
        name: "adminNotes",
        label: t("pages.bookings.fields.adminNotes"),
        type: "textarea",
        fullWidth: true,
      },
    ],
    [t]
  );

  const { getSubscriptionBookingsColumns } = useTableColumns();
  const { can } = usePermission();

  const canUpdate = can(PERMISSION_KEYS.BOOKING_UPDATE);
  const [activeView, setActiveView] = useState(VIEW_LIST);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(null);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
    open: false,
  });

  const BOOKING_STATUS_OPTIONS = useMemo(() => [
    { value: "all", label: t("filters.statusAll") },
    { value: BookingStatus.PENDING, label: t("status.pending") },
    { value: BookingStatus.CONFIRMED, label: t("status.confirmed") },
    { value: BookingStatus.IN_PROGRESS, label: t("status.in_progress") },
    { value: BookingStatus.COMPLETED, label: t("status.completed") },
    { value: BookingStatus.CANCELLED, label: t("status.cancelled") },
  ], [t]);

  const listQueryParams = useMemo(() => {
    const params = {
      take: pagination.take,
      skip: pagination.skip,
      subscriptionId,
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (statusFilter && statusFilter !== "all") {
      params.status = statusFilter.toUpperCase();
    }

    if (monthFilter && activeView === VIEW_LIST) {
      params.month = monthFilter.month() + 1;
      params.year = monthFilter.year();
    }

    return params;
  }, [searchTerm, statusFilter, monthFilter, pagination, subscriptionId, activeView]);

  const calendarQueryParams = useMemo(() => {
    const params = {
      subscriptionId,
      month: monthFilter ? monthFilter.month() + 1 : dayjs().month() + 1,
      year: monthFilter ? monthFilter.year() : dayjs().year(),
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (statusFilter && statusFilter !== "all") {
      params.status = statusFilter.toUpperCase();
    }

    return params;
  }, [monthFilter, searchTerm, statusFilter, subscriptionId]);

  const { data: listBookingsResponse, isLoading: isListLoading } = useBookings(listQueryParams, {
    enabled: Boolean(subscriptionId) && activeView === VIEW_LIST,
  });

  const { data: calendarBookingsResponse, isLoading: isCalendarLoading } = useCalendarBookings(calendarQueryParams, {
    enabled: Boolean(subscriptionId) && activeView === VIEW_CALENDAR,
  });

  const isLoading = activeView === VIEW_LIST ? isListLoading : isCalendarLoading;

  const bookings = useMemo(() => {
    if (activeView === VIEW_LIST) {
      return listBookingsResponse?.bookings || [];
    }
    return calendarBookingsResponse?.bookings || [];
  }, [activeView, listBookingsResponse, calendarBookingsResponse]);

  const totalCount = activeView === VIEW_LIST 
    ? (listBookingsResponse?.totalCount || 0)
    : (calendarBookingsResponse?.totalCount || 0);
  const { mutate: updateBooking, isPending: isUpdating } = useUpdateBooking();

  const firstBookingId = useMemo(() => {
    if (bookings.length === 0) return null;
    return bookings[0].id;
  }, [bookings]);

  const statusOptions = useMemo(() => {
    const currentStatus = modalState.data?.status;
    if (!currentStatus) return [];

    const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];

    const allOptions = [
      { label: t("status.pending"), value: BookingStatus.PENDING },
      { label: t("status.confirmed"), value: BookingStatus.CONFIRMED },
      { label: t("status.in_progress"), value: BookingStatus.IN_PROGRESS },
      { label: t("status.completed"), value: BookingStatus.COMPLETED },
      { label: t("status.cancelled"), value: BookingStatus.CANCELLED },
    ];

    return allOptions.filter(
      (opt) =>
        opt.value === currentStatus || allowedTransitions.includes(opt.value),
    );
  }, [modalState.data?.status, t]);

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

  const editFields = useMemo(
    () => [
      {
        name: "bookingDate",
        label: t("table.date"),
        type: "date",
        rules: [{ required: true, message: t("table.date") }],
        disabledDate,
      },
      {
        name: "status",
        label: t("table.status"),
        type: "select",
        options: statusOptions,
        rules: [{ required: true, message: t("table.status") }],
      },
      {
        name: "adminNotes",
        label: t("pages.bookings.fields.adminNotes") || "Admin Notes",
        type: "textarea",
      },
    ],
    [statusOptions, t, disabledDate],
  );

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data, open: true });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null, open: false });
  }, []);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setMonthFilter(date);
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }, []);

  const handlePageChange = useCallback((page, pageSize) => {
    const skip = (page - 1) * pageSize;
    setPagination({ skip, take: pageSize });
  }, []);

  const handleRowAction = useCallback(
    (action, record) => {
      if (action === "view") {
        openModal("view", record);
      } else if (action === "edit") {
        openModal("edit", record);
      }
    },
    [openModal],
  );

  const handleUpdate = useCallback(
    (values) => {
      if (modalState.data?.id) {
        const payload = {};
        const originalData = modalState.data;

        // Only send changed fields
        if (values.bookingDate) {
          const newDate = values.bookingDate.format("YYYY-MM-DD");
          if (newDate !== originalData.bookingDate) {
            payload.bookingDate = newDate;
          }
        }

        if (values.status && values.status !== originalData.status) {
          payload.status = values.status;
        }

        if (values.adminNotes !== undefined && values.adminNotes !== originalData.adminNotes) {
          payload.adminNotes = values.adminNotes;
        }

        if (Object.keys(payload).length > 0) {
          updateBooking(
            { id: modalState.data.id, data: payload },
            { onSuccess: closeModal },
          );
        } else {
          closeModal();
        }
      }
    },
    [modalState.data, updateBooking, closeModal],
  );

  const handleBack = useCallback(() => {
    router.push("/subscriptions");
  }, [router]);

  const handleViewChange = useCallback((view) => {
    setActiveView(view);
  }, []);

  const currentPage = Math.floor(pagination.skip / pagination.take) + 1;

  const columns = useMemo(
    () =>
      getSubscriptionBookingsColumns(
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
        canUpdate,
      ),
    [getSubscriptionBookingsColumns, handleRowAction, firstBookingId, canUpdate],
  );

  const headerActions = (
    <button
      type="button"
      className={styles.backButton}
      onClick={handleBack}
      aria-label="Back to subscriptions"
    >
      <ArrowLeftOutlined />
      {t("pages.subscriptions.backToList")}
    </button>
  );

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        title={`${t("pages.subscriptions.subscription")} #${subscriptionId || ""}`}
        subtitle={t("pages.subscriptions.detailSubtitle")}
        actions={headerActions}
      />

      <div className={styles.viewToolbar}>
        <div className={styles.filtersWrapper}>
          <FiltersBar
            searchPlaceholder={t("filters.searchPlaceholder")}
            onSearch={handleSearch}
            onStatusChange={handleStatusChange}
            onDateChange={handleDateChange}
            showStatusFilter
            showSearch
            showDateFilter
            dateValue={activeView === VIEW_CALENDAR ? (monthFilter || dayjs()) : monthFilter}
            statusValue={statusFilter}
            searchValue={searchTerm}
            statusOptions={BOOKING_STATUS_OPTIONS}
          />
        </div>
        <ViewToggle
          activeView={activeView}
          onViewChange={handleViewChange}
        />
      </div>

      <ErrorBoundary>
        {activeView === VIEW_LIST && (
          <AntTable
            columns={columns}
            dataSource={bookings}
            rowKey="id"
            showPagination
            defaultPageSize={10}
            loading={isLoading}
            rowClassName={(record) =>
              record.id === firstBookingId && record.status === "CONFIRMED" ? styles.highlightedRow : ""
            }
            pagination={{
              current: currentPage,
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
        )}

        {activeView === VIEW_CALENDAR && (
          <BookingsCalendar
            bookings={bookings}
            loading={isLoading}
            onAction={handleRowAction}
            canEdit={canUpdate}
            totalCount={totalCount}
            // Only first booking is editable in this specific master-detail view
            customCanEdit={(record) => record.id === firstBookingId && canUpdate}
          />
        )}
      </ErrorBoundary>

      <DetailModal
        open={
          modalState.open &&
          (modalState.type === "view" || modalState.type === "edit")
        }
        onClose={closeModal}
        onSave={handleUpdate}
        title={t("modals.booking")}
        data={modalState.data}
        fields={modalState.type === "edit" ? editFields : BOOKING_FIELDS}
        mode={modalState.type === "edit" ? "edit" : "view"}
        loading={isUpdating}
      >
        {modalState.type === "view" && (
          <>
            {modalState.data?.subscription && (
              <DetailSection
                sections={createSubscriptionSections(modalState.data.subscription, t)}
              />
            )}
            {modalState.data?.bookingExtraServices?.length > 0 && (
              <DetailSection
                sections={createBookingExtraServicesSections(modalState.data.bookingExtraServices, t)}
              />
            )}
          </>
        )}
      </DetailModal>
    </div>
  );
};

const SubscriptionDetailPageWrapper = () => (
  <PageGuard permission={PERMISSION_KEYS.SUBSCRIPTION_READ}>
    <SubscriptionDetailPage />
  </PageGuard>
);

export default SubscriptionDetailPageWrapper;
