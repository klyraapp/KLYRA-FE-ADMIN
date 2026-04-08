/**
 * Profile Page
 * Displays user profile information with role and permissions
 */

import { getPermissionEnum } from "@/utils/utils";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Divider, Input, Row, Tag, Typography } from "antd";
import { useSelector } from "react-redux";
import { getTranslation } from "../../../translations";

const { Title } = Typography;

const Profile = () => {
  const { profileData } = useSelector((state) => state.users);

  const renderRole = () => {
    if (!profileData?.role) {
      return <Tag>-</Tag>;
    }

    if (typeof profileData.role === "string") {
      return <Tag>{profileData.role}</Tag>;
    }

    if (Array.isArray(profileData.role)) {
      return profileData.role.map((role, index) => (
        <Tag key={index}>{role?.role?.name || role?.name || role}</Tag>
      ));
    }

    return <Tag>{profileData.role?.name || "-"}</Tag>;
  };

  const renderPermissions = () => {
    if (!profileData?.permissions || !Array.isArray(profileData.permissions)) {
      return <Tag>-</Tag>;
    }

    return profileData.permissions.map((permission) => (
      <Tag key={permission?.name || permission}>
        {getPermissionEnum(permission?.name || permission)}
      </Tag>
    ));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={15}>
        <Col xs={24}>
          <h1>{getTranslation(profileData?.userLanguage, "user_profile")}</h1>
        </Col>
        <Col xs={24} md={12}>
          <Title level={5}>
            {getTranslation(profileData?.userLanguage, "name")}
          </Title>
          <Input
            size="large"
            value={profileData?.profileName || "-"}
            placeholder="Name"
            prefix={<UserOutlined />}
            readOnly
          />
        </Col>
        <Col xs={24} md={12}>
          <Title level={5}>
            {getTranslation(profileData?.userLanguage, "email")}
          </Title>
          <Input
            size="large"
            value={profileData?.email || "-"}
            placeholder="Email"
            prefix={<MailOutlined />}
            readOnly
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col xs={24} md={12}>
          <Title level={5}>
            {getTranslation(profileData?.userLanguage, "role")}
          </Title>
          {renderRole()}
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col xs={24} md={12}>
          <Title level={5}>
            {getTranslation(profileData?.userLanguage, "permission")}
          </Title>
          {renderPermissions()}
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
