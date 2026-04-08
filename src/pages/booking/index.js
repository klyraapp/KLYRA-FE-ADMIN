/**
 * Bookings Page
 * Displays all cleaning bookings with filters and actions
 * Admin can only view and delete bookings (no create/edit)
 */

import ActionMenu from "@/components/ActionMenu/ActionMenu";
import AntTable from "@/components/AntTable/AntTable";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import DetailModal from "@/components/common/DetailModal";
import DetailSection from "@/components/common/DetailSection";
import { createSubscriptionSections, createBookingExtraServicesSections } from "@/components/common/DetailSection/sectionHelpers";
import ExportSettingsModal from "@/components/export/ExportSettingsModal";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import PageHeader from "@/components/PageHeader/PageHeader";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { useBookings, useDeleteBooking, useDisabledDates, useUpdateBooking } from "@/hooks/useBookings";
import useTableColumns from "@/hooks/useTableColumns";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/bookings.module.css";
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
import { ExportOutlined } from "@ant-design/icons";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import { getSafeValue, safeMap } from "@/utils/safeRendering";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";

const BOOKING_VIEW_ACTIONS = [
  { key: "view", label: "View Details" },
  { key: "delete", label: "Delete" },
];

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



const BookingsPage = () => {
  const { t } = useTranslation();
  const { getBookingsColumns } = useTableColumns();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(null);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });
  const [exportModalOpen, setExportModalOpen] = useState(false);
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
  }, [searchTerm, statusFilter, monthFilter, pagination]);

  const { data: bookingsResponse, isLoading } = useBookings(queryParams);
  const bookings = useMemo(() => {
    return bookingsResponse?.bookings || [];
  }, [bookingsResponse]);
  const totalCount = bookingsResponse?.totalCount || 0;
  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBooking();
  const { mutate: updateBooking, isPending: isUpdating } = useUpdateBooking();

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data, open: true });
  }, []);

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

  const handleExport = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const fetchBookingsForExport = useCallback(async () => {
    return bookings;
  }, [bookings]);

  const handleRowAction = useCallback(
    (action, record) => {
      if (action === "view") {
        openModal("view", record);
      } else if (action === "edit") {
        openModal("edit", record);
      } else if (action === "delete") {
        openModal("delete", record);
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
            {
              onSuccess: closeModal,
            },
          );
        } else {
          closeModal();
        }
      }
    },
    [modalState.data, updateBooking, closeModal],
  );

  const handleDelete = useCallback(() => {
    if (modalState.data?.id) {
      deleteBooking(modalState.data.id, {
        onSuccess: closeModal,
      });
    }
  }, [modalState.data, deleteBooking, closeModal]);

  const columns = useMemo(
    () =>
      getBookingsColumns(
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatArea,
        formatCurrency,
        formatDate,
        formatTime,
        formatBookingStatus,
        true,
        true,
      ),
    [getBookingsColumns, handleRowAction],
  );

  const headerActions = (
    <>
      <button
        type="button"
        className={styles.exportButton}
        onClick={handleExport}
        aria-label="Export"
      >
        <ExportOutlined className={styles.exportIcon} />
      </button>
    </>
  );

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        titleKey="pages.bookings.title"
        subtitleKey="pages.bookings.subtitle"
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

      <ErrorBoundary>
        <AntTable
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          showPagination
          defaultPageSize={10}
          loading={isLoading}
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
          <ErrorBoundary>
            {modalState.data?.subscription && (
              <DetailSection
                sections={createSubscriptionSections(modalState.data?.subscription)}
              />
            )}
            {modalState.data?.bookingExtraServices?.length > 0 && (
              <DetailSection
                sections={createBookingExtraServicesSections(modalState.data?.bookingExtraServices)}
              />
            )}
          </ErrorBoundary>
        )}
      </DetailModal>

      <DeleteConfirmModal
        open={modalState.open && modalState.type === "delete"}
        onConfirm={handleDelete}
        onCancel={closeModal}
        title={t("modals.deleteBooking")}
        itemName={modalState.data?.bookingNumber}
        loading={isDeleting}
      />

      <ExportSettingsModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        pageKey="bookings"
        pageLabel={t("navigation.bookings")}
        getData={fetchBookingsForExport}
      />
    </div>
  );
};

export default BookingsPage;
