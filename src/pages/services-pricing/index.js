/**
 * Services & Pricing Page
 * Displays service packages and pricing table
 * Uses shared reusable components
 * Integrates pricing rules selection in create/edit modals
 */

import ActionMenu from "@/components/ActionMenu/ActionMenu";
import AntTable from "@/components/AntTable/AntTable";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import DetailModal from "@/components/common/DetailModal";
import DetailSection from "@/components/common/DetailSection/DetailSection";
import {
  createExtraServicesSection,
  createPricingRulesSection,
} from "@/components/common/DetailSection/sectionHelpers";
import ExportSettingsModal from "@/components/export/ExportSettingsModal";
import FiltersBar from "@/components/FiltersBar/FiltersBar";
import PageHeader from "@/components/PageHeader/PageHeader";
import PricingRulesSelect from "@/components/PricingRulesSelect/PricingRulesSelect";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import ServiceCard from "@/components/ServiceCard/ServiceCard";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import {
  useCreateService,
  useDeleteService,
  useServicesAdmin,
  useUpdateService,
} from "@/hooks/useServices";
import { usePricingRulesList } from "@/hooks/usePricingRules";
import useTableColumns from "@/hooks/useTableColumns";
import useToast from "@/hooks/useToast";
import { useTranslation } from "@/hooks/useTranslation";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import { getSafeValue, safeMap } from "@/utils/safeRendering";
import { formatCurrency } from "@/utils/formatters";
import { ExportOutlined } from "@ant-design/icons";
import { useCallback, useMemo, useState } from "react";
import styles from "@/styles/services-pricing.module.css";

const ServicesPricingPage = () => {
  const { t } = useTranslation();
  const { getServicesColumns } = useTableColumns();
  const [searchTerm, setSearchTerm] = useState("");
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

  const SERVICE_EDIT_FIELDS = useMemo(
    () => [
      {
        name: "name",
        label: t("table.serviceName"),
        rules: [{ required: true }],
      },
      {
        name: "description",
        label: t("table.description"),
        rules: [{ required: true }],
        fullWidth: true,
      },
      { name: "icon", label: t("fields.icon"), type: "icon-upload", fullWidth: true },
      { name: "displayOrder", label: t("fields.displayOrder"), type: "number" },
      {
        name: "isActive",
        label: t("table.status"),
        type: "switch",
      },
      {
        name: "allowRecurringBookings",
        label: t("table.allowRecurring"),
        type: "switch",
      },
      {
        name: "allowOneTimeBookings",
        label: t("table.allowOneTime"),
        type: "switch",
      },
      {
        name: "applyDrivingCharged",
        label: t("table.applyDrivingFee"),
        type: "switch",
      },
      {
        name: "priceRuleIds",
        label: t("fields.pricingRules"),
        type: "custom",
        component: PricingRulesSelect,
        fullWidth: true,
      },
    ],
    [t],
  );

  const SERVICE_VIEW_FIELDS = useMemo(
    () => [
      { name: "id", label: "ID" },
      { name: "name", label: t("table.serviceName") },
      {
        name: "description",
        label: t("table.description"),
        fullWidth: true,
      },
      { name: "icon", label: t("fields.icon"), type: "icon-upload", fullWidth: true },
      { name: "displayOrder", label: t("fields.displayOrder"), type: "number" },
      {
        name: "isActive",
        label: t("table.status"),
        type: "switch",
      },
      {
        name: "allowRecurringBookings",
        label: t("table.allowRecurring"),
        type: "switch",
      },
      {
        name: "allowOneTimeBookings",
        label: t("table.allowOneTime"),
        type: "switch",
      },
      {
        name: "applyDrivingCharged",
        label: t("table.applyDrivingFee"),
        type: "switch",
      },
    ],
    [t],
  );

  const queryParams = useMemo(() => {
    const params = {
      take: pagination.take,
      skip: pagination.skip,
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (statusFilter && statusFilter !== "all") {
      params.isActive = statusFilter === "active";
    }

    if (monthFilter) {
      params.month = monthFilter.month() + 1;
    }

    return params;
  }, [searchTerm, statusFilter, monthFilter, pagination]);

  const { data: servicesResponse = {}, isLoading } =
    useServicesAdmin(queryParams);
  const services = servicesResponse?.services || [];
  const totalCount = servicesResponse?.totalCount || 0;
  const { mutate: deleteService, isPending: isDeleting } =
    useDeleteService();
  const { mutate: updateService, isPending: isUpdating } =
    useUpdateService();
  const { mutate: createService, isPending: isCreating } =
    useCreateService();
  const { data: pricingRulesPool = [] } = usePricingRulesList();
  const toast = useToast();

  /**
   * Extracts priceRuleIds from service data for pre-populating
   * the multi-select dropdown on edit.
   */
  const getEditData = useCallback((serviceData) => {
    if (!serviceData) return {};

    const editData = { ...serviceData };

    if (Array.isArray(serviceData.pricingRules)) {
      editData.priceRuleIds = serviceData.pricingRules
        .filter((rule) => rule?.id !== undefined)
        .map((rule) => rule.id);
    } else if (Array.isArray(serviceData.priceRuleIds)) {
      editData.priceRuleIds = serviceData.priceRuleIds;
    } else {
      editData.priceRuleIds = [];
    }

    return editData;
  }, []);

  const serviceCards = useMemo(() => {
    const data = Array.isArray(services) ? services : [];
    return data.slice(0, 8).map((service) => {
      const pricingRules = service?.pricingRules || [];
      const baseRule =
        pricingRules.find((rule) => rule.ruleType === "BASE") ||
        pricingRules[0];
      const priceVal = baseRule ? baseRule.price : 0;

      return {
        id: service?.id,
        title: service?.name || t("common.unknown"),
        planName: service?.description || "-",
        price: `${parseFloat(priceVal).toFixed(0)} NOK`,
        status: service?.isActive ? "active" : "inactive",
        originalData: service,
      };
    });
  }, [services]);

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data, open: true });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null, open: false });
  }, []);

  const handleAddService = useCallback(() => {
    openModal("create", { isActive: true });
  }, [openModal]);

  const handleExport = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const fetchServicesForExport = useCallback(async () => {
    return services;
  }, [services]);

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

  const handleCardEdit = useCallback(
    (card) => {
      openModal("edit", card.originalData);
    },
    [openModal],
  );

  const handleCardDelete = useCallback(
    (card) => {
      openModal("delete", card.originalData);
    },
    [openModal],
  );

  const handleDelete = useCallback(() => {
    if (modalState.data?.id) {
      deleteService(modalState.data.id, {
        onSuccess: closeModal,
      });
    }
  }, [modalState.data, deleteService, closeModal]);

  const handleSave = useCallback(
    (values) => {
      const payload = { ...values };

      const { allowRecurringBookings, allowOneTimeBookings, priceRuleIds } = payload;

      // Validation: At least one toggle must be ON
      if (!allowRecurringBookings && !allowOneTimeBookings) {
        toast.error("messages.enableAtLeastOneBookingType");
        return;
      }

      // Validation: At least one pricing rule must be selected
      if (!priceRuleIds || priceRuleIds.length === 0) {
        toast.error("messages.selectAtLeastOnePricingRule");
        return;
      }

      // Validation: If both toggles are ON, ensure at least one of each rule type is selected
      if (allowRecurringBookings && allowOneTimeBookings) {
        const selectedRules = (priceRuleIds || [])
          .map(id => pricingRulesPool.find(r => r.id === id))
          .filter(Boolean);
        
        const hasRecurring = selectedRules.some(r => r.serviceType === "RECURRING");
        const hasOneTime = selectedRules.some(r => r.serviceType === "ONE_TIME");

        if (!hasRecurring || !hasOneTime) {
          toast.error("messages.selectOneRecurringOneTime");
          return;
        }
      } else if (allowRecurringBookings) {
        const selectedRules = (priceRuleIds || [])
          .map(id => pricingRulesPool.find(r => r.id === id))
          .filter(Boolean);
        if (!selectedRules.some(r => r.serviceType === "RECURRING")) {
          toast.error("messages.selectOneRecurring");
          return;
        }
      } else if (allowOneTimeBookings) {
        const selectedRules = (priceRuleIds || [])
          .map(id => pricingRulesPool.find(r => r.id === id))
          .filter(Boolean);
        if (!selectedRules.some(r => r.serviceType === "ONE_TIME")) {
          toast.error("messages.selectOneOneTime");
          return;
        }
      }

      if (Array.isArray(payload.priceRuleIds)) {
        payload.priceRuleIds = payload.priceRuleIds.map(Number);
      }

      if (modalState.type === "edit" && modalState.data?.id) {
        updateService(
          { id: modalState.data.id, data: payload },
          { onSuccess: closeModal },
        );
      } else if (modalState.type === "create") {
        createService(payload, { onSuccess: closeModal });
      }
    },
    [modalState, updateService, createService, closeModal, toast, pricingRulesPool],
  );

  const columns = useMemo(
    () =>
      getServicesColumns(
        handleRowAction,
        styles,
        StatusBadge,
        ActionMenu,
        formatCurrency,
      ),
    [getServicesColumns, handleRowAction],
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
      <PrimaryButton
        textKey="buttons.addServices"
        onClick={handleAddService}
      >
        {t("buttons.addServices")}
      </PrimaryButton>
    </>
  );

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        titleKey="pages.services.title"
        subtitleKey="pages.services.subtitle"
        actions={headerActions}
      />

      <div className={styles.cardsSection}>
        <ErrorBoundary>
          <div className={styles.cardsGrid}>
            {safeMap(serviceCards, (card) => (
              <ServiceCard
                key={card?.id}
                variant="package"
                title={card?.title}
                subtitle={card?.planName}
                price={card?.price}
                status={card?.status}
                onEdit={() => handleCardEdit(card)}
                onDelete={() => handleCardDelete(card)}
              />
            ))}
          </div>
        </ErrorBoundary>
      </div>

      <FiltersBar
        searchPlaceholder={t("filters.searchPlaceholder")}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        showStatusFilter
        showDateFilter
      />

      <AntTable
        columns={columns}
        dataSource={services}
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

      <DetailModal
        open={modalState.open && modalState.type === "view"}
        onClose={closeModal}
        title={t("modals.service")}
        data={modalState.data}
        fields={SERVICE_VIEW_FIELDS}
        mode="view"
      >
        {modalState.data?.pricingRules &&
          modalState.data.pricingRules.length > 0 && (
            <DetailSection
              sections={createPricingRulesSection(
                modalState.data.pricingRules,
              )}
            />
          )}
        {modalState.data?.extraServices && (
          <DetailSection
            sections={createExtraServicesSection(
              modalState.data.extraServices,
            )}
          />
        )}
      </DetailModal>

      <DetailModal
        open={modalState.open && modalState.type === "edit"}
        onClose={closeModal}
        onSave={handleSave}
        title={t("modals.service")}
        data={getEditData(modalState.data)}
        fields={SERVICE_EDIT_FIELDS}
        mode="edit"
        loading={isUpdating}
      />

      <DetailModal
        open={modalState.open && modalState.type === "create"}
        onClose={closeModal}
        onSave={handleSave}
        title={t("modals.service")}
        data={{
          isActive: true,
          priceRuleIds: [],
          applyDrivingCharged: false,
          allowRecurringBookings: false,
          allowOneTimeBookings: false,
        }}
        fields={SERVICE_EDIT_FIELDS}
        mode="edit"
        loading={isCreating}
      />

      <DeleteConfirmModal
        open={modalState.open && modalState.type === "delete"}
        onConfirm={handleDelete}
        onCancel={closeModal}
        title={t("modals.deleteService")}
        itemName={modalState.data?.name}
        loading={isDeleting}
      />

      <ExportSettingsModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        pageKey="services"
        pageLabel={t("navigation.services")}
        getData={fetchServicesForExport}
      />
    </div>
  );
};

export default ServicesPricingPage;
