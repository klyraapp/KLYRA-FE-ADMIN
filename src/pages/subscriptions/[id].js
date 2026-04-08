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
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import PageHeader from "@/components/PageHeader/PageHeader";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { useBookings, useDisabledDates, useUpdateBooking } from "@/hooks/useBookings";
import useTableColumns from "@/hooks/useTableColumns";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/subscriptions.module.css";
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

const BOOKING_FIELDS = [
  { name: "bookingNumber", label: "Booking Number" },
  { name: "status", label: "Status" },
  { name: "paymentStatus", label: "Payment Status" },
  { name: "contactFirstName", label: "First Name" },
  { name: "contactLastName", label: "Last Name" },
  { name: "contactEmail", label: "Email" },
  { name: "contactPhone", label: "Phone" },
  { name: ["service", "name"], label: "Service" },
  { name: "accommodationType", label: "Accommodation Type" },
  { name: "numberOfBathrooms", label: "Number of Bathrooms" },
  { name: "areaSqm", label: "Area (sqm)" },
  { name: "areaSqft", label: "Area (sqft)" },
  { name: "bookingDate", label: "Booking Date" },
  { name: "startTime", label: "Start Time" },
  { name: "serviceStreetAddress", label: "Street Address", fullWidth: true },
  { name: "serviceCity", label: "City" },
  { name: "servicePostalCode", label: "Postal Code" },
  { name: "serviceCountry", label: "Country" },
  { name: "hasFreeParking", label: "Free Parking", type: "boolean" },
  { name: "parkingSurcharge", label: "Parking Surcharge" },
  { name: "hasPets", label: "Has Pets", type: "boolean" },
  { name: "petSurcharge", label: "Pet Surcharge" },
  { name: "accessMethod", label: "Access Method" },
  { name: "subtotal", label: "Subtotal" },
  { name: "taxRate", label: "Tax Rate (%)" },
  { name: "taxAmount", label: "Tax Amount" },
  { name: "discountAmount", label: "Discount Amount" },
  { name: "totalAmount", label: "Total Amount" },
  {
    name: "specialInstructions",
    label: "Special Instructions",
    type: "textarea",
    fullWidth: true,
  },
  { name: "createdAt", label: "Created At", fullWidth: true },
  { name: "updatedAt", label: "Updated At", fullWidth: true },
];

const SubscriptionDetailPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const subscriptionId = id ? Number(id) : null;

  const { getSubscriptionBookingsColumns } = useTableColumns();
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

  const queryParams = useMemo(() => {
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

    if (monthFilter) {
      params.month = monthFilter.month() + 1;
      params.year = monthFilter.year();
    }

    return params;
  }, [searchTerm, statusFilter, monthFilter, pagination, subscriptionId]);

  const { data: bookingsResponse, isLoading } = useBookings(queryParams, {
    enabled: Boolean(subscriptionId),
  });

  const bookings = useMemo(() => {
    return bookingsResponse?.bookings || [];
  }, [bookingsResponse]);

  const totalCount = bookingsResponse?.totalCount || 0;
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

  const { data: disabledData } = useDisabledDates();

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
      ),
    [getSubscriptionBookingsColumns, handleRowAction, firstBookingId],
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

      <FiltersBar
        searchPlaceholder={t("filters.searchPlaceholder")}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        showStatusFilter
        showDateFilter
        statusOptions={BOOKING_STATUS_OPTIONS}
      />

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
                sections={createSubscriptionSections(modalState.data.subscription)}
              />
            )}
            {modalState.data?.bookingExtraServices?.length > 0 && (
              <DetailSection
                sections={createBookingExtraServicesSections(modalState.data.bookingExtraServices)}
              />
            )}
          </>
        )}
      </DetailModal>
    </div>
  );
};

export default SubscriptionDetailPage;
