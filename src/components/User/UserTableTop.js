import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PERMISSIONS } from "@/utils/constant";
import { checkUserAssignPermissions } from "@/utils/utils";
import { getTranslation } from "../../../translations";

const UserTableTop = ({ handleOpenModal }) => {
  const [userCreatePermission, setUserCreatePermission] = useState(false);
  const { profileData } = useSelector((state) => state.users);

  useEffect(() => {
    setUserCreatePermission(
      checkUserAssignPermissions(
        PERMISSIONS?.ADD_USERS,
        profileData?.permissions,
      ),
    );
  }, [profileData?.permissions]);

  return (
    <div style={{ textAlign: "right" }}>
      <Button
        type="primary"
        onClick={handleOpenModal}
        icon={<UserAddOutlined data-testid="user-add-outlined-icon" />}
        disabled={!userCreatePermission}
      >
        {getTranslation(profileData?.userLanguage, "add_user")}
      </Button>
    </div>
  );
};

export default UserTableTop;
