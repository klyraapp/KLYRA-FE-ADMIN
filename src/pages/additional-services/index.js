/**
 * Additional Services Page
 * Displays all additional services with edit and delete actions
 * Uses shared ServiceCard component with 'service' variant
 */

import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import DetailModal from "@/components/common/DetailModal";
import ExportSettingsModal from "@/components/export/ExportSettingsModal";
import PageHeader from "@/components/PageHeader/PageHeader";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import ServiceCard from "@/components/ServiceCard/ServiceCard";
import {
  useCreateExtraService,
  useDeleteExtraService,
  useExtraServices,
  useUpdateExtraService,
} from "@/hooks/useExtraServices";
import { useServices } from "@/hooks/useServices";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "@/styles/additional-services.module.css";
import { ExportOutlined } from "@ant-design/icons";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import { safeMap } from "@/utils/safeRendering";
import { useCallback, useMemo, useState } from "react";

const AdditionalServicesPage = () => {
  const { t } = useTranslation();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
    open: false,
  });

  const { data: extraServices = [], isLoading } = useExtraServices();
  const { data: services = [] } = useServices();
  const { mutate: deleteExtraService, isPending: isDeleting } =
    useDeleteExtraService();
  const { mutate: updateExtraService, isPending: isUpdating } =
    useUpdateExtraService();
  const { mutate: createExtraService, isPending: isCreating } =
    useCreateExtraService();

  const serviceOptions = useMemo(() => {
    const data = Array.isArray(services) ? services : [];
    return data.map((service) => ({
      value: service?.id,
      label: service?.name || "Unknown Service",
    }));
  }, [services]);

  const extraServiceFields = useMemo(
    () => [
      {
        name: "name",
        label: t("table.serviceName"),
        rules: [{ required: true }],
      },
      {
        name: "serviceId",
        label: "Related Service",
        type: "select",
        rules: [{ required: true }],
        options: serviceOptions,
      },
      {
        name: "description",
        label: t("table.description"),
        rules: [{ required: true }],
        fullWidth: true,
      },
      {
        name: "price",
        label: t("table.price"),
        type: "number",
        rules: [{ required: true }],
      },
      { name: "icon", label: "Icon", type: "icon-upload", fullWidth: true },
      { name: "displayOrder", label: "Display Order", type: "number" },
      { name: "isActive", label: t("common.active"), type: "switch" },
    ],
    [serviceOptions, t],
  );

  const serviceCards = useMemo(() => {
    return safeMap(extraServices, (service, index) => ({
      id: service?.id,
      number: service?.displayOrder || index + 1,
      serviceName: service?.name || "Unknown",
      price: `NOK ${parseFloat(service?.price || 0).toFixed(0)}`,
      originalData: service,
    }), []);
  }, [extraServices]);

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data, open: true });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null, open: false });
  }, []);

  const handleAddService = useCallback(() => {
    openModal("create", { isActive: true, displayOrder: 0 });
  }, [openModal]);

  const handleExport = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const fetchExtraServicesForExport = useCallback(async () => {
    return extraServices;
  }, [extraServices]);

  const handleEdit = useCallback(
    (card) => {
      openModal("edit", card.originalData);
    },
    [openModal],
  );

  const handleDelete = useCallback(
    (card) => {
      openModal("delete", card.originalData);
    },
    [openModal],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (modalState.data?.id) {
      deleteExtraService(modalState.data.id, {
        onSuccess: closeModal,
      });
    }
  }, [modalState.data, deleteExtraService, closeModal]);

  const handleSave = useCallback(
    (values) => {
      const formattedValues = {
        ...values,
        price: values.price ? Number(values.price) : 0,
        displayOrder: values.displayOrder ? Number(values.displayOrder) : 0,
        serviceId: values.serviceId ? Number(values.serviceId) : undefined,
      };

      if (modalState.type === "edit" && modalState.data?.id) {
        updateExtraService(
          { id: modalState.data.id, data: formattedValues },
          { onSuccess: closeModal },
        );
      } else if (modalState.type === "create") {
        createExtraService(formattedValues, { onSuccess: closeModal });
      }
    },
    [modalState, updateExtraService, createExtraService, closeModal],
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
      <PrimaryButton textKey="buttons.addServices" onClick={handleAddService}>
        Add Services
      </PrimaryButton>
    </>
  );

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <PageHeader
          titleKey="pages.additionalServices.title"
          subtitleKey="pages.additionalServices.subtitle"
          actions={headerActions}
        />
        <div className={styles.cardsGrid}>{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        titleKey="pages.additionalServices.title"
        subtitleKey="pages.additionalServices.subtitle"
        actions={headerActions}
      />

      <div className={styles.cardsGrid}>
        <ErrorBoundary>
          {safeMap(serviceCards, (card) => (
            <ServiceCard
              key={card?.id}
              variant="service"
              title={card?.serviceName}
              price={card?.price}
              number={card?.number}
              onEdit={() => handleEdit(card)}
              onDelete={() => handleDelete(card)}
            />
          ))}
        </ErrorBoundary>
      </div>

      <DetailModal
        open={
          modalState.open &&
          (modalState.type === "view" || modalState.type === "edit")
        }
        onClose={closeModal}
        onSave={handleSave}
        title={t("modals.additionalService")}
        data={modalState.data}
        fields={extraServiceFields}
        mode={modalState.type === "view" ? "view" : "edit"}
        loading={isUpdating}
      />

      <DetailModal
        open={modalState.open && modalState.type === "create"}
        onClose={closeModal}
        onSave={handleSave}
        title={t("modals.additionalService")}
        data={{ isActive: true, displayOrder: 0 }}
        fields={extraServiceFields}
        mode="edit"
        loading={isCreating}
      />

      <DeleteConfirmModal
        open={modalState.open && modalState.type === "delete"}
        onConfirm={handleDeleteConfirm}
        onCancel={closeModal}
        title={t("modals.deleteAdditionalService")}
        itemName={modalState.data?.name}
        loading={isDeleting}
      />

      <ExportSettingsModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        pageKey="additionalServices"
        pageLabel={t("navigation.additionalServices")}
        getData={fetchExtraServicesForExport}
      />
    </div>
  );
};

export default AdditionalServicesPage;
