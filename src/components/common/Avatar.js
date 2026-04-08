import { Avatar, Dropdown, Menu } from "antd";
import {
  ProfileOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Logout from "@/components/common/Logout";
import { getTranslation } from "../../../translations";
import { useSelector } from "react-redux";

const CustomAvatar = () => {
  const { profileData } = useSelector((state) => state.users);

  const items = [
    {
      key: "Profile",
      label: (
        <Link href="/profile">
          <ProfileOutlined />
          {getTranslation(profileData?.userLanguage, "profile")}
        </Link>
      ),
    },
    {
      key: "Logout",
      label: <Logout />,
    },
    {
      key: "Settings",
      label: (
        <Link href="/setting">
          <SettingOutlined />
          {getTranslation(profileData?.userLanguage, "setting")}
        </Link>
      ),
    },
  ];

  const menuHeaderDropdown = (
    <Menu style={{ minWidth: "160px" }}>
      {items?.map((item) => (
        <div key={item.key}>
          <Menu.Item>{item.label}</Menu.Item>
          <Menu.Divider />
        </div>
      ))}
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menuHeaderDropdown} placement="bottomLeft" arrow>
        <div
          style={{
            marginTop: "-18px",
          }}
        >
          <Avatar icon={<UserOutlined />} />
        </div>
      </Dropdown>
    </>
  );
};

export default CustomAvatar;
