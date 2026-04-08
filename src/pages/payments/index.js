/**
 * Payments Page
 * Displays all payment records with filters and pagination
 */

import ActionMenu from "@/components/ActionMenu/ActionMenu";
import AntTable from "@/components/AntTable/AntTable";
import DetailModal from "@/components/common/DetailModal";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import PageHeader from "@/components/PageHeader/PageHeader";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { useDebounce } from "@/hooks/useDebounce";
import { usePayments } from "@/hooks/usePayments";
import useTableColumns from "@/hooks/useTableColumns";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/payments.module.css";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ExportOutlined } from "@ant-design/icons";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import { safeMap } from "@/utils/safeRendering";
import ExportSettingsModal from "@/components/export/ExportSettingsModal";
import { InputNumber, Select, Space } from "antd";
import { useCallback, useMemo, useState } from "react";

const PaymentsPage = () => {
  const { t } = useTranslation();
  const { getPaymentsColumns } = useTableColumns();

  const PAYMENT_FIELDS = useMemo(() => [
    { name: "id", label: t("table.paymentId") },
    { name: "bookingnumber", label: t("table.bookingNumber") },
    { name: "bookingid", label: t("table.bookingId") },
    { name: "userid", label: t("table.userId") },
    { name: "subscriptionid", label: t("table.subscriptionId") },
    {
      name: "contactname",
      label: t("table.contactName"),
      render: (_, record) => {
        const first = record?.contactfirstname || "";
        const last = record?.contactlastname || "";
        const full = `${first} ${last}`.trim();
        return full || "-";
      },
    },
    { name: "contactemail", label: t("table.contactEmail") },
    { name: "amount", label: t("table.amount"), render: (val) => formatCurrency(val) },
    { name: "paymentmethod", label: t("table.paymentMethod") },
    { name: "transactionid", label: t("table.transactionId") },
    {
      name: "status",
      label: t("table.status"),
      render: (status) => {
        const statusMap = {
          PAID: "paid",
          PENDING: "pending",
          FAILED: "failed",
        };
        return <StatusBadge status={statusMap[status]} />;
      },
    },
    { name: "paidat", label: t("table.paidAt"), render: (val) => val ? formatDate(val) : "-" },
    { name: "failurereason", label: t("table.failureReason"), fullWidth: true },
    { name: "createdat", label: t("table.createdAt"), fullWidth: true, render: (val) => formatDate(val) },
    { name: "updatedat", label: t("table.updatedAt"), fullWidth: true, render: (val) => formatDate(val) },
  ], [t]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [extraFilters, setExtraFilters] = useState({
    subscriptionId: null,
    bookingId: null,
    userId: null,
    createdAt: null,
    updatedAt: null,
  });
  const [orderFilter, setOrderFilter] = useState("DESC");
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
    open: false,
  });

  const PAYMENT_STATUS_OPTIONS = useMemo(() => [
    { value: "all", label: t("filters.statusAll") },
    { value: "PAID", label: t("status.paid") },
    { value: "PENDING", label: t("status.pending") },
    { value: "FAILED", label: t("status.failed") },
  ], [t]);
  
  const ORDER_OPTIONS = useMemo(() => [
    { value: "DESC", label: t("filters.latest") },
    { value: "ASC", label: t("filters.old") },
  ], [t]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedExtraFilters = useDebounce(extraFilters, 500);

  const queryParams = useMemo(() => {
    const params = {
      take: pagination.take,
      skip: pagination.skip,
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (statusFilter && statusFilter !== "all") {
      params.status = statusFilter.toUpperCase();
    }

    if (orderFilter) {
      params.order = orderFilter;
    }

    if (debouncedExtraFilters.subscriptionId) params.subscriptionId = debouncedExtraFilters.subscriptionId;
    if (debouncedExtraFilters.bookingId) params.bookingId = debouncedExtraFilters.bookingId;
    if (debouncedExtraFilters.userId) params.userId = debouncedExtraFilters.userId;
    if (debouncedExtraFilters.createdAt) params.createdAt = debouncedExtraFilters.createdAt.toISOString();
    if (debouncedExtraFilters.updatedAt) params.updatedAt = debouncedExtraFilters.updatedAt.toISOString();

    return params;
  }, [debouncedSearchTerm, statusFilter, orderFilter, debouncedExtraFilters, pagination]);

  const { data: paymentsResponse, isLoading } = usePayments(queryParams);

  const payments = useMemo(() => paymentsResponse?.payments || [], [paymentsResponse]);
  const totalCount = paymentsResponse?.totalCount || 0;

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }, []);

  const handleOrderChange = useCallback((value) => {
    setOrderFilter(value);
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }, []);

  const handleExtraFilterChange = useCallback((key, value) => {
    setExtraFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }, []);

  const handlePageChange = useCallback((page, pageSize) => {
    const skip = (page - 1) * pageSize;
    setPagination({ skip, take: pageSize });
  }, []);

  const handleRowAction = useCallback((action, record) => {
    if (action === "view") {
      setModalState({ type: "view", data: record, open: true });
    }
  }, []);

  const handleExport = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const fetchPaymentsForExport = useCallback(async () => {
    return payments;
  }, [payments]);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null, open: false });
  }, []);

  const columns = useMemo(
    () =>
      getPaymentsColumns(
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatDate,
        formatCurrency
      ),
    [getPaymentsColumns, handleRowAction]
  );

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        titleKey="pages.payments.title"
        subtitleKey="pages.payments.subtitle"
        actions={
          <button
            type="button"
            className={styles.exportButton}
            onClick={handleExport}
            aria-label="Export"
          >
            <ExportOutlined className={styles.exportIcon} />
          </button>
        }
      />

      <FiltersBar
        onStatusChange={handleStatusChange}
        showStatusFilter={true}
        showDateFilter={false}
        showSearch={false}
        statusOptions={PAYMENT_STATUS_OPTIONS}
      >
        <Space wrap>
          <InputNumber
            placeholder={t("table.subscriptionId")}
            value={extraFilters.subscriptionId}
            onChange={(val) => handleExtraFilterChange("subscriptionId", val)}
            className={styles.idFilter}
          />
          <InputNumber
            placeholder={t("table.bookingId")}
            value={extraFilters.bookingId}
            onChange={(val) => handleExtraFilterChange("bookingId", val)}
            className={styles.idFilter}
          />
          <InputNumber
            placeholder={t("table.userId")}
            value={extraFilters.userId}
            onChange={(val) => handleExtraFilterChange("userId", val)}
            className={styles.idFilter}
          />
          <Select
            placeholder={t("filters.sortBy")}
            value={orderFilter}
            onChange={handleOrderChange}
            options={ORDER_OPTIONS}
            className={styles.statusSelect}
            style={{ width: 140 }}
          />
        </Space>
      </FiltersBar>

      <ErrorBoundary>
        <AntTable
          columns={columns}
          dataSource={payments}
          rowKey="id"
          showPagination
          defaultPageSize={10}
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => setModalState({ type: "view", data: record, open: true }),
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
        title={t("pages.payments.payment")}
        data={modalState.data}
        fields={PAYMENT_FIELDS}
        mode="view"
      />
      <ExportSettingsModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        pageKey="payments"
        pageLabel={t("navigation.payments")}
        getData={fetchPaymentsForExport}
      />
    </div>
  );
};

export default PaymentsPage;
