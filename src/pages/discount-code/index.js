/**
 * Discount Code Page
 * Displays all discount codes with filters and actions
 * Uses shared reusable components
 */

import ActionMenu from "@/components/ActionMenu/ActionMenu";
import AntTable from "@/components/AntTable/AntTable";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import DetailModal from "@/components/common/DetailModal";
import ExportSettingsModal from "@/components/export/ExportSettingsModal";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import PageHeader from "@/components/PageHeader/PageHeader";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import {
  useCreatePromoCode,
  useDeletePromoCode,
  usePromoCodes,
  useUpdatePromoCode,
} from "@/hooks/usePromoCodes";
import useTableColumns from "@/hooks/useTableColumns";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/discount-code.module.css";
import { formatDate } from "@/utils/formatters";
import { useDebounce } from "@/hooks/useDebounce";
import { ExportOutlined } from "@ant-design/icons";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import { safeMap } from "@/utils/safeRendering";
import { useCallback, useMemo, useState } from "react";
import usePermission from "@/hooks/usePermission";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import PageGuard from "@/components/common/RBAC/PageGuard";
import PermissionGuard from "@/components/common/RBAC/PermissionGuard";

const DiscountCodePage = () => {
  const { t } = useTranslation();
  const { can } = usePermission();
  const { getDiscountCodesColumns } = useTableColumns();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(null);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
    open: false,
  });

  const canCreate = can(PERMISSION_KEYS.PROMO_CODE_CREATE);
  const canUpdate = can(PERMISSION_KEYS.PROMO_CODE_UPDATE);
  const canDelete = can(PERMISSION_KEYS.PROMO_CODE_DELETE);

  const PROMO_CODE_FIELDS = useMemo(
    () => [
      { name: "code", label: t("table.code"), rules: [{ required: true }] },
      {
        name: "discountType",
        label: t("table.discountType"),
        type: "select",
        rules: [{ required: true }],
        options: [
          { value: "PERCENTAGE", label: t("table.percentage") },
          { value: "FIXED", label: t("table.fixedAmount") },
        ],
      },
      {
        name: "discountValue",
        label: t("table.discount"),
        type: "number",
        rules: [{ required: true }],
      },
      { name: "validFrom", label: t("table.validFrom"), type: "date" },
      { name: "validUntil", label: t("table.validTo"), type: "date" },
      {
        name: "maxUsageCount",
        label: t("table.maxUsageCount"),
        type: "number",
      },
      {
        name: "maxUsagePerUser",
        label: t("table.maxUsagePerUser"),
        type: "number",
      },
      { name: "isActive", label: t("common.active"), type: "switch" },
    ],
    [t]
  );

  const queryParams = useMemo(() => {
    const params = {
      take: pagination.take,
      skip: pagination.skip,
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (statusFilter && statusFilter !== "all") {
      params.isActive = statusFilter === "active";
    }

    if (monthFilter) {
      params.month = monthFilter.month() + 1;
    }

    return params;
  }, [debouncedSearchTerm, statusFilter, monthFilter, pagination]);

  const { data: promoCodes = [], isLoading } = usePromoCodes(queryParams);
  const { mutate: deletePromoCode, isPending: isDeleting } =
    useDeletePromoCode();
  const { mutate: updatePromoCode, isPending: isUpdating } =
    useUpdatePromoCode();
  const { mutate: createPromoCode, isPending: isCreating } =
    useCreatePromoCode();

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data, open: true });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null, open: false });
  }, []);

  const handleCreateCode = useCallback(() => {
    openModal("create", { isActive: true });
  }, [openModal]);

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
    setPagination({ skip: (page - 1) * pageSize, take: pageSize });
  }, []);

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

  const handleDelete = useCallback(() => {
    if (modalState.data?.id) {
      deletePromoCode(modalState.data.id, {
        onSuccess: closeModal,
      });
    }
  }, [modalState.data, deletePromoCode, closeModal]);

  const handleSave = useCallback(
    (values) => {
      const formattedValues = {
        ...values,
        discountValue: values.discountValue ? Number(values.discountValue) : 0,
        maxUsageCount: values.maxUsageCount ? Number(values.maxUsageCount) : 0,
        maxUsagePerUser: values.maxUsagePerUser
          ? Number(values.maxUsagePerUser)
          : 1,
        validFrom: values.validFrom
          ? values.validFrom.toISOString()
          : undefined,
        validUntil: values.validUntil
          ? values.validUntil.toISOString()
          : undefined,
      };

      if (modalState.type === "edit" && modalState.data?.id) {
        updatePromoCode(
          { id: modalState.data.id, data: formattedValues },
          { onSuccess: closeModal },
        );
      } else if (modalState.type === "create") {
        createPromoCode(formattedValues, { onSuccess: closeModal });
      }
    },
    [modalState, updatePromoCode, createPromoCode, closeModal],
  );

  const columns = useMemo(
    () =>
      getDiscountCodesColumns(
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatDate,
        canUpdate,
        canDelete,
      ),
    [getDiscountCodesColumns, handleRowAction, canUpdate, canDelete],
  );

  const handleExport = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const fetchPromoCodesForExport = useCallback(async () => {
    return promoCodes;
  }, [promoCodes]);

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
      <PermissionGuard permission={PERMISSION_KEYS.PROMO_CODE_CREATE}>
        <PrimaryButton textKey="buttons.createCode" onClick={handleCreateCode}>
          {t("createCode")}
        </PrimaryButton>
      </PermissionGuard>
    </>
  );

  return (
    <PageGuard permission={PERMISSION_KEYS.PROMO_CODE_READ}>
    <div className={styles.pageContainer}>
      <PageHeader
        titleKey="pages.discountCodes.title"
        subtitleKey="pages.discountCodes.subtitle"
        actions={headerActions}
      />

      <FiltersBar
        searchPlaceholder={t("filters.searchPlaceholder")}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        showStatusFilter
        showDateFilter
      />

      <ErrorBoundary>
        <AntTable
          columns={columns}
          dataSource={promoCodes}
          rowKey="id"
          showPagination
          defaultPageSize={10}
          loading={isLoading}
          pagination={{
            current: Math.floor(pagination.skip / pagination.take) + 1,
            pageSize: pagination.take,
            total: promoCodes.length,
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
        onSave={handleSave}
        title={t("modals.discountCode")}
        data={modalState.data}
        fields={PROMO_CODE_FIELDS}
        mode={modalState.type === "view" ? "view" : "edit"}
        loading={isUpdating}
      />

      <DetailModal
        open={modalState.open && modalState.type === "create"}
        onClose={closeModal}
        onSave={handleSave}
        title={t("modals.discountCode")}
        data={{ isActive: true }}
        fields={PROMO_CODE_FIELDS}
        mode="edit"
        loading={isCreating}
      />

      <DeleteConfirmModal
        open={modalState.open && modalState.type === "delete"}
        onConfirm={handleDelete}
        onCancel={closeModal}
        title={t("modals.deleteDiscountCode")}
        itemName={modalState.data?.code}
        loading={isDeleting}
      />

      <ExportSettingsModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        pageKey="discountCodes"
        pageLabel={t("navigation.discountCodes")}
        getData={fetchPromoCodesForExport}
      />
    </div>
    </PageGuard>
  );
};

export default DiscountCodePage;
