/**
 * RolesTableTop Component
 * Header section for the roles table with Create Role button
 * Uses RBAC hook for permission-based button visibility
 */

import usePermission from "@/hooks/usePermission";
import { PERMISSION_KEYS } from "@/utils/permissionConstants";
import PermissionGuard from "@/components/common/RBAC/PermissionGuard";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { memo } from "react";

const RolesTableTop = ({ handleOpenModal }) => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: "right", marginBottom: 16 }}>
      <PermissionGuard permission={PERMISSION_KEYS.ROLE_CREATE}>
        <Button
          type="primary"
          onClick={handleOpenModal}
          icon={<UserAddOutlined />}
        >
          {t("pages.roles.addRole") || "Add Role"}
        </Button>
      </PermissionGuard>
    </div>
  );
};

RolesTableTop.propTypes = {
  handleOpenModal: PropTypes.func.isRequired,
};

export default memo(RolesTableTop);
