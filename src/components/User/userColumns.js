import { Button, Space } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { getTranslation } from "../../../translations";

export const userColumns = ({
  handleEdit,
  handleDelete,
  userUpdatePermission,
  userDeletePermission,
  profileData,
}) => [
  {
    title: getTranslation(profileData?.userLanguage, "Id"),
    dataIndex: "id",
    key: "id",
  },
  {
    title: getTranslation(profileData?.userLanguage, "name"),
    dataIndex: "name",
    key: "name",
  },
  {
    title: getTranslation(profileData?.userLanguage, "email"),
    dataIndex: "email",
    key: "email",
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
          disabled={!userUpdatePermission}
        />
        <Button
          type="primary"
          shape="circle"
          onClick={() => handleDelete(record)}
          icon={<DeleteFilled />}
          size="small"
          disabled={!userDeletePermission}
        />
      </Space>
    ),
  },
];
