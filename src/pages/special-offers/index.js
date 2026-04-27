/**
 * Special Offers Page
 * Displays all special offers with filters and actions
 * Uses shared reusable components
 */

import ActionMenu from "@/components/ActionMenu/ActionMenu";
import AntTable from "@/components/AntTable/AntTable";
import DetailModal from "@/components/common/DetailModal";
import ExportSettingsModal from "@/components/export/ExportSettingsModal";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import PageHeader from "@/components/PageHeader/PageHeader";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { useCreateOffer, useOffers, useUpdateOffer } from "@/hooks/useOffers";
import useTableColumns from "@/hooks/useTableColumns";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/special-offers.module.css";
import { formatDate } from "@/utils/formatters";
import { ExportOutlined } from "@ant-design/icons";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import { safeMap } from "@/utils/safeRendering";
import { useCallback, useMemo, useState } from "react";
import usePermission from "@/hooks/usePermission";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import PageGuard from "@/components/common/RBAC/PageGuard";
import PermissionGuard from "@/components/common/RBAC/PermissionGuard";

const SpecialOffersPage = () => {
  const { t } = useTranslation();
  const { can } = usePermission();
  const { getSpecialOffersColumns } = useTableColumns();
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

  const canCreate = can(PERMISSION_KEYS.OFFER_CREATE);
  const canUpdate = can(PERMISSION_KEYS.OFFER_UPDATE);
  // Special Offers usually don't have a separate delete but let's check update
  const canDelete = false; 

  const OFFER_FIELDS = useMemo(
    () => [
      {
        name: "name",
        label: t("table.offerName"),
        rules: [{ required: true }],
      },
      {
        name: "description",
        label: t("table.description"),
        type: "textarea",
        rules: [{ required: true }],
      },
      {
        name: "discountType",
        label: t("table.discountType"),
        type: "select",
        rules: [{ required: true }],
        options: [
          { value: "PERCENTAGE", label: "Percentage" },
          { value: "FIXED", label: "Fixed Amount" },
        ],
      },
      {
        name: "discountValue",
        label: t("table.discount"),
        type: "number",
        rules: [{ required: true }],
      },
      { name: "validFrom", label: t("table.validFrom"), type: "date" },
      { name: "validTo", label: t("table.validTo"), type: "date" },
      { name: "isActive", label: t("common.active"), type: "switch" },
    ],
    [t],
  );

  const queryParams = useMemo(() => {
    const params = {
      take: pagination.take,
      skip: pagination.skip,
    };

    if (searchTerm) {
      params.name = searchTerm;
    }

    if (statusFilter && statusFilter !== "all") {
      params.isActive = statusFilter === "active";
    }

    if (monthFilter) {
      params.month = monthFilter.month() + 1;
    }

    return params;
  }, [searchTerm, statusFilter, monthFilter, pagination]);

  const { data: offersResponse, isLoading } = useOffers(queryParams);

  const offers = useMemo(() => {
    if (!offersResponse) return [];
    return Array.isArray(offersResponse)
      ? offersResponse[0] || []
      : offersResponse.data || [];
  }, [offersResponse]);

  const totalCount = useMemo(() => {
    if (!offersResponse) return 0;
    return Array.isArray(offersResponse) ? offersResponse[1] || 0 : 0;
  }, [offersResponse]);

  const { mutate: updateOffer, isPending: isUpdating } = useUpdateOffer();
  const { mutate: createOffer, isPending: isCreating } = useCreateOffer();

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data, open: true });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null, open: false });
  }, []);

  const handleCreateOffer = useCallback(() => {
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
      }
    },
    [openModal],
  );

  const handleSave = useCallback(
    (values) => {
      const formattedValues = {
        ...values,
        discountValue: values.discountValue ? Number(values.discountValue) : 0,
        validFrom: values.validFrom
          ? values.validFrom.toISOString()
          : undefined,
        validTo: values.validTo ? values.validTo.toISOString() : undefined,
      };

      if (modalState.type === "edit" && modalState.data?.id) {
        updateOffer(
          { id: modalState.data.id, data: formattedValues },
          { onSuccess: closeModal },
        );
      } else if (modalState.type === "create") {
        createOffer(formattedValues, { onSuccess: closeModal });
      }
    },
    [modalState, updateOffer, createOffer, closeModal],
  );

  const columns = useMemo(
    () =>
      getSpecialOffersColumns(
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatDate,
        canUpdate,
        canDelete,
      ),
    [getSpecialOffersColumns, handleRowAction, canUpdate, canDelete],
  );

  const handleExport = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const fetchOffersForExport = useCallback(async () => {
    return offers;
  }, [offers]);

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
      <PermissionGuard permission={PERMISSION_KEYS.OFFER_CREATE}>
        <PrimaryButton textKey="buttons.createOffer" onClick={handleCreateOffer}>
          {t("buttons.createOffer")}
        </PrimaryButton>
      </PermissionGuard>
    </>
  );

  return (
    <PageGuard permission={PERMISSION_KEYS.OFFER_READ}>
    <div className={styles.pageContainer}>
      <PageHeader
        titleKey="pages.specialOffers.title"
        subtitleKey="pages.specialOffers.subtitle"
        actions={headerActions}
      />

      <FiltersBar
        searchPlaceholder={t("filters.searchOfferPlaceholder")}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        showStatusFilter
        showDateFilter
      />

      <ErrorBoundary>
        <AntTable
          columns={columns}
          dataSource={offers}
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
        onSave={handleSave}
        title={t("modals.specialOffer")}
        data={modalState.data}
        fields={OFFER_FIELDS}
        mode={modalState.type === "view" ? "view" : "edit"}
        loading={isUpdating}
      />

      <DetailModal
        open={modalState.open && modalState.type === "create"}
        onClose={closeModal}
        onSave={handleSave}
        title={t("modals.specialOffer")}
        data={{ isActive: true }}
        fields={OFFER_FIELDS}
        mode="edit"
        loading={isCreating}
        isCreateMode
      />

      <ExportSettingsModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        pageKey="specialOffers"
        pageLabel={t("navigation.specialOffers")}
        getData={fetchOffersForExport}
      />
    </div>
    </PageGuard>
  );
};

export default SpecialOffersPage;
