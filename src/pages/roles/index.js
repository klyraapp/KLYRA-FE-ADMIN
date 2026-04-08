import React, { useState, useEffect } from "react";
import { Table } from "antd";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import { getPermissions } from "@/api/rolesApi";
import CreateRoles from "@/components/Roles/CreateRole";
import { useDispatch, useSelector } from "react-redux";
import RolesTableTop from "@/components/Roles/RolesTableTop";
import {
  setRolesModal,
  setRolesModalDelete,
  setSelectedRole,
} from "@/redux/reducers/rolesState";
import { roleColumns } from "@/components/Roles/roleColumns";
import DeleteRoles from "@/components/Roles/DeleteRoles";
import { getRoles } from "@/api/rolesApi/index";
import { useQuery } from "@tanstack/react-query";
import { PERMISSIONS } from "@/utils/constant";
import { checkUserAssignPermissions } from "@/utils/utils";
import { useRouter } from "next/router";

const Roles = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { rolesModal, rolesModalD, selectedRole } = useSelector(
    (state) => state.roles,
  );
  const [editRolesData, setEditRolesData] = useState({});
  const [permissionsData, setPermissionsData] = useState([]);
  const [roleUpdatePermission, setRoleUpdatePermission] = useState(false);
  const [roleDeletePermission, setRoleDeletePermission] = useState(false);
  const { profileData } = useSelector((state) => state.users);

  useEffect(() => {
    setRoleUpdatePermission(
      checkUserAssignPermissions(
        PERMISSIONS?.EDIT_ROLES,
        profileData?.permissions,
      ),
    );
    setRoleDeletePermission(
      checkUserAssignPermissions(
        PERMISSIONS?.DELETE_ROLES,
        profileData?.permissions,
      ),
    );
  }, [profileData?.permissions]);

  const { data, refetch } = useQuery({
    queryKey: ["getRoles"],
    queryFn: getRoles,
    retry: false,
    select: (data) => data.data,
  });

  useQuery({
    queryKey: ["getPermissions"],
    queryFn: getPermissions,
    onSuccess: (response) => {
      setPermissionsData(response);
    },
    retry: false,
    select: (data) => data.data,
  });

  const handleDelete = (roles) => {
    dispatch(setSelectedRole(roles));
    dispatch(setRolesModalDelete(true));
  };

  const handleOpenModal = () => dispatch(setRolesModal(true));

  const handleCloseModal = () => {
    setEditRolesData({});
    dispatch(setRolesModal(false));
  };

  const handleCloseModalD = () => {
    dispatch(setSelectedRole({}));
    dispatch(setRolesModalDelete(false));
  };

  const handleEdit = (roles) => {
    setEditRolesData(roles);
    handleOpenModal();
  };

  useEffect(() => {
    let roleViewPermission = checkUserAssignPermissions(
      PERMISSIONS?.VIEW_ROLES,
      profileData?.permissions,
    );

    if (!roleViewPermission) {
      router.push("/404");
    }
  }, [router, profileData?.permissions]);

  return (
    <div>
      <RolesTableTop handleOpenModal={handleOpenModal} />
      <ErrorBoundary>
        <Table
          dataSource={data}
          columns={roleColumns({
            handleEdit,
            handleDelete,
            dispatch,
            roleUpdatePermission,
            roleDeletePermission,
            profileData,
          })}
        />
      </ErrorBoundary>
      {rolesModal && (
        <CreateRoles
          open={rolesModal}
          handleCloseModal={handleCloseModal}
          editRolesData={editRolesData}
          fetchData={refetch}
          permissionsData={permissionsData}
        />
      )}

      <DeleteRoles
        open={rolesModalD}
        handleCloseModal={handleCloseModalD}
        fetchData={refetch}
        selectedRole={selectedRole}
      />
    </div>
  );
};
Roles.allowed_roles = [];

export default Roles;
