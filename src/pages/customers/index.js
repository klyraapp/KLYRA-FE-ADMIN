/**
 * Customers Page
 * Displays customer list with search, filters, and actions
 * Uses shared AntTable component
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
import { useDebounce } from "@/hooks/useDebounce";
import useTableColumns from "@/hooks/useTableColumns";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/hooks/useUsers";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import { getSafeValue, safeMap } from "@/utils/safeRendering";
import { formatDate } from "@/utils/formatters";
import { ExportOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { useCallback, useMemo, useState } from "react";
import styles from "@/styles/customers.module.css";

const CustomersPage = () => {
  const { t } = useTranslation();
  const { getCustomersColumns } = useTableColumns();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(null);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });
  const [orderFilter, setOrderFilter] = useState("DESC");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
    open: false,
  });

  const CUSTOMER_EDIT_FIELDS = useMemo(
    () => [
      {
        name: "firstName",
        label: t("fields.firstName"),
        rules: [{ required: true }],
      },
      {
        name: "lastName",
        label: t("fields.lastName"),
        rules: [{ required: true }],
      },
      {
        name: "email",
        label: t("fields.email"),
        rules: [{ required: true, type: "email" }],
      },
      {
        name: "password",
        label: t("fields.password"),
        type: "password",
        rules: [{ min: 6 }],
      },
      { name: "phone", label: t("fields.phone") },
      {
        name: "languagePreference",
        label: t("fields.language"),
        type: "select",
        options: [
          { value: "en", label: t("settings.english") },
          { value: "ar", label: "Arabic" },
        ],
      },
    ],
    [t],
  );

  const CUSTOMER_FIELDS = useMemo(
    () => [
      {
        name: "firstName",
        label: t("fields.firstName"),
        rules: [{ required: true }],
      },
      {
        name: "lastName",
        label: t("fields.lastName"),
        rules: [{ required: true }],
      },
      {
        name: "email",
        label: t("fields.email"),
        rules: [{ required: true, type: "email" }],
      },
      { name: "phone", label: t("fields.phone") },
      {
        name: "languagePreference",
        label: t("fields.language"),
        type: "select",
        options: [
          { value: "en", label: t("settings.english") },
          { value: "ar", label: "Arabic" },
        ],
      },
    ],
    [t],
  );

  const CUSTOMER_CREATE_FIELDS = useMemo(
    () => [
      {
        name: "firstName",
        label: t("fields.firstName"),
        rules: [{ required: true }],
      },
      {
        name: "lastName",
        label: t("fields.lastName"),
        rules: [{ required: true }],
      },
      {
        name: "email",
        label: t("fields.email"),
        rules: [{ required: true, type: "email" }],
      },
      {
        name: "password",
        label: t("fields.password"),
        type: "password",
        rules: [{ required: true, min: 6 }],
      },
      { name: "phone", label: t("fields.phone") },
      {
        name: "languagePreference",
        label: t("fields.language"),
        type: "select",
        options: [
          { value: "en", label: t("settings.english") },
          { value: "ar", label: "Arabic" },
        ],
      },
    ],
    [t],
  );

  const ORDER_OPTIONS = useMemo(
    () => [
      { value: "DESC", label: t("filters.latest") },
      { value: "ASC", label: t("filters.old") },
    ],
    [t],
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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

    if (orderFilter) {
      params.order = orderFilter;
    }

    return params;
  }, [debouncedSearchTerm, statusFilter, monthFilter, orderFilter, pagination]);

  const { data: customers = [], isLoading } = useUsers(queryParams);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();

  const transformedData = useMemo(() => {
    return safeMap(customers, (customer) => ({
      id: customer?.id,
      customerId: `U-${customer?.id || 0}`,
      name:
        `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() ||
        "-",
      email: customer?.email || "-",
      contact: customer?.phone || "-",
      totalBookings: 0,
      totalSpent: "0 NOK",
      joinDate: formatDate(customer?.createdAt),
      status: customer?.isActive ? "active" : "inactive",
      originalData: customer,
    }), []);
  }, [customers]);

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data, open: true });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null, open: false });
  }, []);

  const handleAddUser = useCallback(() => {
    openModal("create", {});
  }, [openModal]);

  const handleExport = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const fetchCustomersForExport = useCallback(async () => {
    return transformedData;
  }, [transformedData]);

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

  const handleOrderChange = useCallback((value) => {
    setOrderFilter(value);
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }, []);

  const handlePageChange = useCallback((page, pageSize) => {
    setPagination({ skip: (page - 1) * pageSize, take: pageSize });
  }, []);

  const handleRowAction = useCallback(
    (action, record) => {
      const originalData = record?.originalData || record;
      if (action === "view") {
        openModal("view", originalData);
      } else if (action === "edit") {
        openModal("edit", originalData);
      } else if (action === "delete") {
        openModal("delete", originalData);
      }
    },
    [openModal],
  );

  const handleDelete = useCallback(() => {
    if (modalState.data?.id) {
      deleteUser(modalState.data.id, {
        onSuccess: closeModal,
      });
    }
  }, [modalState.data, deleteUser, closeModal]);

  const handleSave = useCallback(
    (values) => {
      if (modalState.type === "edit" && modalState.data?.id) {
        const updateData = { ...values };

        if (!updateData.password || updateData.password.trim() === "") {
          delete updateData.password;
        }

        updateUser(
          { id: modalState.data.id, data: updateData },
          { onSuccess: closeModal },
        );
      } else if (modalState.type === "create") {
        createUser(values, { onSuccess: closeModal });
      }
    },
    [modalState, updateUser, createUser, closeModal],
  );

  const columns = useMemo(
    () => getCustomersColumns(handleRowAction, styles, StatusBadge, ActionMenu),
    [getCustomersColumns, handleRowAction],
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
      <PrimaryButton textKey={t("buttons.addCustomer")} onClick={handleAddUser}>
        {t("buttons.addCustomer")}
      </PrimaryButton>
    </>
  );

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        titleKey={t("pages.customers.title")}
        subtitleKey={t("pages.customers.subtitle")}
        actions={headerActions}
      />

      <FiltersBar
        searchPlaceholder={t("filters.searchPlaceholder")}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        showStatusFilter
        showDateFilter
      >
        <Select
          placeholder={t("filters.sortBy")}
          value={orderFilter}
          onChange={handleOrderChange}
          options={ORDER_OPTIONS}
          className={styles.statusSelect}
          style={{ width: 140 }}
        />
      </FiltersBar>

      <ErrorBoundary>
        <AntTable
          columns={columns}
          dataSource={transformedData}
          rowKey="id"
          showPagination
          defaultPageSize={10}
          loading={isLoading}
          pagination={{
            current: Math.floor(pagination.skip / pagination.take) + 1,
            pageSize: pagination.take,
            total: transformedData.length,
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
        title={t("modals.customer")}
        data={modalState.data}
        fields={
          modalState.type === "edit" ? CUSTOMER_EDIT_FIELDS : CUSTOMER_FIELDS
        }
        mode={modalState.type === "view" ? "view" : "edit"}
        loading={isUpdating}
        isCreateMode={false}
      />

      <DetailModal
        open={modalState.open && modalState.type === "create"}
        onClose={closeModal}
        onSave={handleSave}
        title={t("modals.customer")}
        data={{}}
        fields={CUSTOMER_CREATE_FIELDS}
        mode="edit"
        loading={isCreating}
        isCreateMode={true}
      />

      <DeleteConfirmModal
        open={modalState.open && modalState.type === "delete"}
        onConfirm={handleDelete}
        onCancel={closeModal}
        title={t("modals.deleteCustomer")}
        itemName={`${modalState.data?.firstName || ""} ${modalState.data?.lastName || ""}`.trim()}
        loading={isDeleting}
      />

      <ExportSettingsModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        pageKey="customers"
        pageLabel={t("navigation.customers")}
        getData={fetchCustomersForExport}
      />
    </div>
  );
};

export default CustomersPage;
