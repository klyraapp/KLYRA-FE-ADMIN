import { getRoles } from "@/api/rolesApi";
import { createUser, updateUser } from "@/api/userApi";
import Config from "@/components/common/Cofig";
import { buttonTheme } from "@/features/auth";
import { getPermissionEnum } from "@/utils/utils";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getTranslation } from "../../../translations";

const { Option } = Select;

const CreateUser = ({
  open,
  handleCloseModal,
  editUserData,
  fetchData,
  permissionsData,
  userAssignPermission,
}) => {
  const [form] = Form.useForm();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [previouseAssignedRoles, setPreviouseAssignedRoles] = useState([]);
  const { profileData } = useSelector((state) => state.users);

  const [previouseAssignedPermissions, setPreviouseAssignedPermissions] =
    useState([]);

  const { mutate: mutateCreate, isLoading: createLoading } = useMutation({
    mutationFn: createUser,
  });

  const { mutate: mutateUpdate, isLoading: updateLoading } = useMutation({
    mutationFn: (data) => updateUser(editUserData?.id, data),
  });

  const { data } = useQuery({
    queryKey: ["getRoles"],
    queryFn: getRoles,
    retry: false,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (editUserData?.id) {
      const assignedPermissions = editUserData?.permissions?.map(
        (item) => item?.id,
      );

      const assignedRoles = editUserData?.userRolePermission?.map(
        (item) => item?.roleId,
      );

      setSelectedRoles(assignedRoles);
      setPreviouseAssignedRoles(assignedRoles);
      setSelectedPermissions(assignedPermissions);
      setPreviouseAssignedPermissions(assignedPermissions);
      form.setFieldsValue({
        name: editUserData?.name,
      });
    } else {
      form.setFieldsValue({
        name: "",
        password: "",
        email: "",
        selectedRoles: "",
      });
    }

    return () => {
      form.setFieldsValue({
        name: "",
        password: "",
        email: "",
      });
    };
  }, [editUserData, form]);

  const handleRoleDeselect = (deselectedValue) => {
    setSelectedRoles(
      selectedRoles?.filter((value) => value !== deselectedValue),
    );
  };

  const handlePermissionDeselect = (deselectedValue) => {
    setSelectedPermissions(
      selectedPermissions?.filter((value) => value !== deselectedValue),
    );
  };

  const onFinish = (formData) => {
    const formValues = {
      name: formData?.name,
    };

    if (!editUserData?.id) {
      formValues.password = formData?.password;
      formValues.email = formData?.email;
      formValues.permissions = selectedPermissions;
      formValues.roles = selectedRoles;
    }

    if (editUserData?.id) {
      formValues.deleteRoles = previouseAssignedRoles?.filter(
        (value) => !selectedRoles?.includes(value),
      );
      formValues.newPermissions = selectedPermissions;

      formValues.deletePermissions = previouseAssignedPermissions?.filter(
        (value) => !selectedPermissions?.includes(value),
      );
      formValues.newRoles = selectedRoles;
    }

    const mutateFunction = editUserData?.id ? mutateUpdate : mutateCreate;

    mutateFunction(formValues, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        fetchData();
        handleCloseModal();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message);
      },
    });
  };

  const handleRoleSelectChange = (selectedValues) => {
    setSelectedRoles(selectedValues);
  };

  const handlePermissionSelectChange = (selectedValues) => {
    setSelectedPermissions(selectedValues);
  };

  return (
    <Modal
      title={
        editUserData?.id
          ? getTranslation(profileData?.userLanguage, "update_user")
          : getTranslation(profileData?.userLanguage, "create_user")
      }
      open={open}
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      footer={null}
    >
      <Form name="createUser" form={form} onFinish={onFinish}>
        <Form.Item
          name="name"
          defaultValue=""
          rules={[
            {
              required: true,
              message: `${getTranslation(
                profileData?.userLanguage,
                "please_enter_your_username",
              )}`,
            },
          ]}
        >
          <Input
            style={{ padding: "10px" }}
            placeholder={getTranslation(profileData?.userLanguage, "username")}
            suffix={<UserOutlined />}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item>
          <Select
            mode="multiple"
            name="role"
            placeholder={getTranslation(
              profileData?.userLanguage,
              "select_roles",
            )}
            onChange={handleRoleSelectChange}
            value={selectedRoles}
            onDeselect={handleRoleDeselect}
            rules={[
              {
                required: true,
                message: `${getTranslation(
                  profileData?.userLanguage,
                  "please_select_role",
                )}`,
              },
            ]}
          >
            {data?.map((role) => (
              <Option key={role?.id} value={role?.id}>
                {role?.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Select
            mode="multiple"
            name="permission"
            placeholder={getTranslation(
              profileData?.userLanguage,
              "select_permissions",
            )}
            onChange={handlePermissionSelectChange}
            value={selectedPermissions}
            onDeselect={handlePermissionDeselect}
            disabled={!userAssignPermission}
          >
            {permissionsData?.map((permission) => (
              <Option key={permission?.id} value={permission?.id}>
                {getPermissionEnum(permission?.name)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {!editUserData?.id && (
          <>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: `${getTranslation(
                    profileData?.userLanguage,
                    "please_enter_your_email",
                  )}`,
                },
              ]}
            >
              <Input
                style={{ padding: "10px" }}
                placeholder={getTranslation(profileData?.userLanguage, "email")}
                suffix={<MailOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: `${getTranslation(
                    profileData?.userLanguage,
                    "please_enter_your_password",
                  )}`,
                },
              ]}
            >
              <Input.Password
                style={{ padding: "10px" }}
                placeholder={getTranslation(
                  profileData?.userLanguage,
                  "password",
                )}
                autoComplete="new-password"
              />
            </Form.Item>
          </>
        )}

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
                loading={updateLoading || createLoading}
                data-testid="create-user-button"
              >
                {editUserData?.id
                  ? getTranslation(profileData?.userLanguage, "update_user")
                  : getTranslation(profileData?.userLanguage, "create_user")}
              </Button>
            </div>
          </Config>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUser;
