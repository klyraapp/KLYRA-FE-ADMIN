import { Button, Space } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { getTranslation } from "../../../translations";

export const roleColumns = ({
  handleEdit,
  handleDelete,
  roleUpdatePermission,
  roleDeletePermission,
  profileData,
}) => {
  return [
    {
      title: getTranslation(profileData?.userLanguage, "Id"),
      dataIndex: "id",
      key: "id",
    },
    {
      title: getTranslation(profileData?.userLanguage, "roles"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: getTranslation(profileData?.userLanguage, "created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: getTranslation(profileData?.userLanguage, "updated_at"),
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: getTranslation(profileData?.userLanguage, "action"),
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            shape="circle"
            icon={<EditFilled />}
            size="small"
            disabled={!roleUpdatePermission}
          />
          <Button
            type="primary"
            shape="circle"
            onClick={() => handleDelete(record)}
            icon={<DeleteFilled />}
            size="small"
            disabled={!roleDeletePermission}
          />
        </Space>
      ),
    },
  ];
};
