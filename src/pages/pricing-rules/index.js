/**
 * Pricing Rules Page
 * Displays pricing rules with table, filters, and CRUD modals
 * Uses shared reusable components for design consistency
 */

import ActionMenu from "@/components/ActionMenu/ActionMenu";
import AntTable from "@/components/AntTable/AntTable";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import DetailModal from "@/components/common/DetailModal";
import DetailSection from "@/components/common/DetailSection/DetailSection";
import {
  createChildRulesSection,
} from "@/components/common/DetailSection/sectionHelpers";
import ExportSettingsModal from "@/components/export/ExportSettingsModal";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import PageHeader from "@/components/PageHeader/PageHeader";
import PricingRuleFormModal from "@/components/PricingRuleFormModal/PricingRuleFormModal";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import {
  useAddChildRule,
  useCreatePricingRule,
  useDeletePricingRule,
  usePricingRules,
  useUpdatePricingRule,
} from "@/hooks/usePricingRules";
import useTableColumns from "@/hooks/useTableColumns";
import useToast from "@/hooks/useToast";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/pricing-rules.module.css";
import { formatCurrency } from "@/utils/formatters";
import { ExportOutlined } from "@ant-design/icons";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import { safeMap } from "@/utils/safeRendering";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import usePermission from "@/hooks/usePermission";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import PageGuard from "@/components/common/RBAC/PageGuard";
import PermissionGuard from "@/components/common/RBAC/PermissionGuard";



const PricingRulesPage = () => {
  const { t } = useTranslation();
  const { can } = usePermission();
  const { getPricingRulesColumns } = useTableColumns();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(null);
  const [pagination, setPagination] = useState({
    skip: 0,
    take: 10,
  });
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
    open: false,
  });

  const canCreate = can(PERMISSION_KEYS.PRICING_RULE_CREATE);
  const canUpdate = can(PERMISSION_KEYS.PRICING_RULE_UPDATE);
  const canDelete = can(PERMISSION_KEYS.PRICING_RULE_DELETE);

  const queryParams = useMemo(() => {
    const params = {
      take: pagination.take,
      skip: pagination.skip,
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (monthFilter) {
      params.month = monthFilter.month() + 1;
    }

    return params;
  }, [debouncedSearchTerm, monthFilter, pagination]);

  const pricingRuleViewFields = useMemo(() => [
    { name: "id", label: t("table.id") || "ID" },
    { name: "name", label: t("pages.pricingRules.fields.name") },
    { name: "ruleType", label: t("pages.pricingRules.fields.ruleType") },
    { name: "serviceType", label: t("pages.pricingRules.fields.serviceType") },
    { name: "maxAreaLimit", label: t("pages.pricingRules.fields.maxAreaLimitShort") },
    { name: "price", label: t("pages.pricingRules.fields.price") },
    { name: "stepSize", label: t("pages.pricingRules.fields.stepSize") },
  ], [t]);

  const { data: rulesResponse = {}, isLoading } =
    usePricingRules(queryParams);
  const rules = rulesResponse?.rules || [];
  const totalCount = rulesResponse?.totalCount || 0;

  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutateAsync: deletePricingRuleAsync, isPending: isDeleting } =
    useDeletePricingRule({ skipInvalidation: true });
  const { mutateAsync: updatePricingRuleAsync, isPending: isUpdating } =
    useUpdatePricingRule({ skipInvalidation: true });
  const { mutateAsync: addChildRuleAsync } = useAddChildRule({
    skipInvalidation: true,
  });
  const { mutate: createPricingRule, isPending: isCreating } =
    useCreatePricingRule();

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data, open: true });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null, open: false });
  }, []);

  const handleAddRule = useCallback(() => {
    openModal("create", null);
  }, [openModal]);

  const handleExport = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const fetchRulesForExport = useCallback(async () => {
    return rules;
  }, [rules]);

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
      } else if (action === "delete") {
        openModal("delete", record);
      }
    },
    [openModal],
  );

  const handleDelete = useCallback(() => {
    if (modalState.data?.id) {
      deletePricingRuleAsync(modalState.data.id).then(() => {
        queryClient.invalidateQueries({ queryKey: ["pricingRules"] });
        toast.success("messages.pricingRuleDeleted");
        closeModal();
      });
    }
  }, [modalState.data, deletePricingRuleAsync, closeModal, queryClient, toast]);

  const handleSave = useCallback(
    async (payload) => {
      try {
        if (modalState.type === "edit" && modalState.data?.id) {
          const { updates, additions, deletions } = payload;
          const operations = [];

          // 1. Process Updates (PATCH)
          if (Array.isArray(updates) && updates.length > 0) {
            updates.forEach((update) => {
              operations.push(
                updatePricingRuleAsync({
                  id: update.id,
                  data: update.data,
                }),
              );
            });
          }

          // 2. Process Additions (POST /child)
          if (Array.isArray(additions) && additions.length > 0) {
            additions.forEach((child) => {
              operations.push(
                addChildRuleAsync({
                  parentId: modalState.data.id,
                  data: child,
                }),
              );
            });
          }

          // 3. Process Deletions (DELETE)
          if (Array.isArray(deletions) && deletions.length > 0) {
            deletions.forEach((id) => {
              operations.push(deletePricingRuleAsync(id));
            });
          }

          if (operations.length > 0) {
            await Promise.all(operations);
            await queryClient.invalidateQueries({ queryKey: ["pricingRules"] });
            toast.success("messages.pricingRuleUpdated");
          }

          closeModal();
        } else if (modalState.type === "create") {
          createPricingRule(payload, { onSuccess: closeModal });
        }
      } catch (err) {
        /* Error handled by mutate onError/global handler */
      }
    },
    [
      modalState,
      updatePricingRuleAsync,
      createPricingRule,
      closeModal,
    ],
  );

  const columns = useMemo(
    () =>
      getPricingRulesColumns(
        handleRowAction,
        styles,
        ActionMenu,
        formatCurrency,
        canUpdate,
        canDelete,
      ),
    [getPricingRulesColumns, handleRowAction, canUpdate, canDelete],
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
      <PermissionGuard permission={PERMISSION_KEYS.PRICING_RULE_CREATE}>
        <PrimaryButton onClick={handleAddRule}>
          {t("buttons.addPricingRule") || "Add Pricing Rule"}
        </PrimaryButton>
      </PermissionGuard>
    </>
  );

  return (
    <PageGuard permission={PERMISSION_KEYS.PRICING_RULE_READ}>
    <div className={styles.pageContainer}>
      <PageHeader
        title="Pricing Rules"
        subtitle="Manage all pricing rules and step configurations"
        actions={headerActions}
      />

      <FiltersBar
        searchPlaceholder="Search pricing rules..."
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        showStatusFilter={false}
        showDateFilter
      />

      <ErrorBoundary>
        <AntTable
          columns={columns}
          dataSource={rules}
          rowKey="id"
          showPagination
          defaultPageSize={10}
          loading={isLoading}
          pagination={{
            current:
              Math.floor(pagination.skip / pagination.take) + 1,
            pageSize: pagination.take,
            total: totalCount,
          }}
          onChange={(paginationConfig) => {
            if (
              paginationConfig?.current &&
              paginationConfig?.pageSize
            ) {
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
        title={t("modals.pricingRule")}
        data={modalState.data}
        fields={pricingRuleViewFields}
        mode="view"
      >
        <ErrorBoundary>
          {modalState.data?.childRules && (
            <DetailSection
              sections={createChildRulesSection(
                modalState.data?.childRules,
                t
              )}
            />
          )}
        </ErrorBoundary>
      </DetailModal>

      <PricingRuleFormModal
        open={
          modalState.open && modalState.type === "edit"
        }
        onClose={closeModal}
        onSave={handleSave}
        data={modalState.data}
        mode="edit"
        loading={isUpdating}
      />

      <PricingRuleFormModal
        open={
          modalState.open && modalState.type === "create"
        }
        onClose={closeModal}
        onSave={handleSave}
        data={null}
        mode="create"
        loading={isCreating}
      />

      <DeleteConfirmModal
        open={modalState.open && modalState.type === "delete"}
        onConfirm={handleDelete}
        onCancel={closeModal}
        title={t("modals.deletePricingRule")}
        itemName={
          modalState.data?.name ||
          `${t("modals.pricingRule")} #${modalState.data?.id || ""}`
        }
        loading={isDeleting}
      />

      <ExportSettingsModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        pageKey="pricingRules"
        pageLabel={t("pages.pricingRules.title")}
        getData={fetchRulesForExport}
      />
    </div>
    </PageGuard>
  );
};

export default PricingRulesPage;
