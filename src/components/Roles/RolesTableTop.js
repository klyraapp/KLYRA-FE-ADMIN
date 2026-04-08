import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PERMISSIONS } from "@/utils/constant";
import { checkUserAssignPermissions } from "@/utils/utils";
import { getTranslation } from "../../../translations";

const RolesTableTop = ({ handleOpenModal }) => {
  const [roleCreatePermission, setRoleCreatePermission] = useState(false);
  const { profileData } = useSelector((state) => state.users);

  useEffect(() => {
    setRoleCreatePermission(
      checkUserAssignPermissions(
        PERMISSIONS?.ADD_ROLES,
        profileData?.permissions,
      ),
    );
  }, [profileData?.permissions]);

  return (
    <div style={{ textAlign: "right" }}>
      <Button
        type="primary"
        onClick={handleOpenModal}
        icon={<UserAddOutlined />}
        disabled={!roleCreatePermission}
      >
        {getTranslation(profileData?.userLanguage, "add_roles")}
      </Button>
    </div>
  );
};

export default RolesTableTop;
