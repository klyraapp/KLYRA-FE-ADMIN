import { createRole, updateRole } from "@/api/rolesApi";
import Config from "@/components/common/Cofig";
import { buttonTheme } from "@/features/auth";
import { getPermissionEnum } from "@/utils/utils";
import { UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getTranslation } from "../../../translations";

const CreateRoles = ({
  open,
  handleCloseModal,
  editRolesData = {},
  fetchData,
  permissionsData,
}) => {
  const [form] = Form.useForm();

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [prevPermissions, setPrevPermissions] = useState([]);
  const [previousPermissionIds, setPreviousPermissionIds] = useState([]);
  const { profileData } = useSelector((state) => state.users);

  const { mutate: mutateCreate } = useMutation({
    mutationFn: createRole,
  });

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: (data) => updateRole(editRolesData?.id, data),
  });

  useEffect(() => {
    if (editRolesData?.id) {
      const rolePermissions = editRolesData?.rolePermission?.map(
        (item) => item?.permissionId,
      );
      setPreviousPermissionIds(rolePermissions);
      form.setFieldsValue({
        name: editRolesData?.name,
      });
      setSelectedPermissions([...rolePermissions]);
      if (permissionsData?.length === rolePermissions?.length) {
        setSelectAll(true);
      } else {
        setSelectAll(false);
      }
      setPrevPermissions([...selectedPermissions]);
    }

    return () => {
      form.setFieldsValue({
        name: "",
      });
      setSelectedPermissions([]);
      setSelectAll(false);
    };
  }, [editRolesData, permissionsData]);

  const onFinish = (formData) => {
    let newPermissions = selectedPermissions?.filter(
      (x) => !prevPermissions?.includes(x),
    );

    const formValues = {
      name: formData?.name,
    };

    if (editRolesData?.id) {
      formValues.deletePermissions = previousPermissionIds?.filter(
        (value) => !newPermissions?.includes(value),
      );
      formValues.newPermissions = newPermissions;
    } else {
      formValues.permissions = selectedPermissions;
    }

    const mutateFunction = editRolesData?.id ? mutateUpdate : mutateCreate;

    mutateFunction(formValues, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        fetchData();

        handleCloseModal();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message);
        handleCloseModal();
      },
    });
  };

  const handlePermissionChange = (permissionKey, checked) => {
    if (checked) {
      setSelectedPermissions((prevSelectedPermissions) => [
        ...prevSelectedPermissions,
        permissionKey,
      ]);
      setSelectAll(selectedPermissions?.length + 1 === permissionsData?.length);
    } else {
      setSelectedPermissions((prevSelectedPermissions) =>
        prevSelectedPermissions?.filter((key) => key !== permissionKey),
      );
      setSelectAll(false);
    }
  };

  const handleCheckAllChange = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedPermissions(
        permissionsData?.map((permission) => permission?.id),
      );
    } else {
      setSelectedPermissions([]);
    }
  };

  return (
    <Modal
      title={
        editRolesData?.name
          ? getTranslation(profileData?.userLanguage, "update_roles")
          : getTranslation(profileData?.userLanguage, "create_roles")
      }
      open={open}
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      footer={null}
    >
      <Form name="createRoles" form={form} onFinish={onFinish}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            style={{ padding: "10px" }}
            placeholder={getTranslation(profileData?.userLanguage, "name")}
            suffix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox
            onChange={(e) => handleCheckAllChange(e.target.checked)}
            checked={selectAll}
          >
            Select All
          </Checkbox>
          <div>
            {permissionsData?.map((permission) => (
              <Checkbox
                name="permissions"
                key={permission?.id}
                onChange={(e) =>
                  handlePermissionChange(permission?.id, e?.target?.checked)
                }
                checked={selectedPermissions.includes(permission?.id)}
              >
                {getPermissionEnum(permission?.name)}
              </Checkbox>
            ))}
          </div>
        </Form.Item>
        <Form.Item>
          <Config theme={buttonTheme}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                style={{ width: "100%", background: "#6286d3", margin: "0" }}
                type="primary"
                htmlType="submit"
                data-testid="role-create-button"
              >
                {editRolesData?.name
                  ? getTranslation(profileData?.userLanguage, "update_role")
                  : getTranslation(profileData?.userLanguage, "create_role")}
              </Button>
            </div>
          </Config>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoles;
