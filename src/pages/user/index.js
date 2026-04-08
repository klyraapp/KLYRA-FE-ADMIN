import React, { useState, useEffect } from "react";
import { Table } from "antd";
import ErrorBoundary from "@/components/common/ErrorBoundary/ErrorBoundary";
import CreateUser from "@/components/User/CreateUser";
import { useDispatch, useSelector } from "react-redux";
import UserTableTop from "@/components/User/UserTableTop";
import {
  setUserModal,
  setUserModalDelete,
  setSelectedRole,
} from "@/redux/reducers/userState";
import { userColumns } from "@/components/User/userColumns";
import DeleteUser from "@/components/User/DeleteUser";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/userApi";
import { PERMISSIONS } from "@/utils/constant";
import { checkUserAssignPermissions } from "@/utils/utils";
import { useRouter } from "next/router";
import { getPermissions } from "@/api/rolesApi";

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { userModal, userModalD, selectedUser } = useSelector(
    (state) => state.users,
  );

  const [editUserData, setEditUserData] = useState({});
  const [permissionsData, setPermissionsData] = useState([]);
  const [userUpdatePermission, setUserUpdatePermission] = useState(false);
  const [userDeletePermission, setUserDeletePermission] = useState(false);
  const [userAssignPermission, setUserAssignPermission] = useState(false);
  const { profileData } = useSelector((state) => state.users);

  useQuery({
    queryKey: ["getPermissions"],
    queryFn: getPermissions,
    onSuccess: (response) => {
      setPermissionsData(response);
    },
    retry: false,
    select: (data) => data.data,
  });

  useEffect(() => {
    setUserUpdatePermission(
      checkUserAssignPermissions(
        PERMISSIONS?.EDIT_USERS,
        profileData?.permissions,
      ),
    );
    setUserDeletePermission(
      checkUserAssignPermissions(
        PERMISSIONS?.DELETE_USERS,
        profileData?.permissions,
      ),
    );
    setUserAssignPermission(
      checkUserAssignPermissions(
        PERMISSIONS?.ASSIGN_PERMISSION,
        profileData?.permissions,
      ),
    );
  }, [profileData?.permissions]);

  const { data, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    retry: false,
    select: (data) => data.data,
  });

  const handleDelete = (user) => {
    dispatch(setSelectedRole(user));
    handleOpenDeleteModal();
  };

  const handleOpenDeleteModal = () => dispatch(setUserModalDelete(true));

  const handleOpenModal = () => dispatch(setUserModal(true));

  const handleCloseModal = () => {
    setEditUserData({});
    dispatch(setUserModal(false));
  };

  const handleCloseDeleteModal = () => {
    dispatch(setSelectedRole({}));
    dispatch(setUserModalDelete(false));
  };

  const handleEdit = (user) => {
    setEditUserData(user);
    handleOpenModal();
  };

  useEffect(() => {
    let userViewPermission = checkUserAssignPermissions(
      PERMISSIONS?.VIEW_USERS,
      profileData?.permissions,
    );

    if (!userViewPermission) {
      router.push("/404");
    }
  }, [router, profileData?.permissions]);

  return (
    <div>
      <UserTableTop handleOpenModal={handleOpenModal} />
      <ErrorBoundary>
        <Table
          dataSource={data}
          columns={userColumns({
            handleEdit,
            handleDelete,
            userDeletePermission,
            userUpdatePermission,
            profileData,
          })}
        />
      </ErrorBoundary>
      {userModal && (
        <CreateUser
          open={userModal}
          handleCloseModal={handleCloseModal}
          editUserData={editUserData}
          fetchData={refetch}
          permissionsData={permissionsData}
          userAssignPermission={userAssignPermission}
        />
      )}

      {userModalD && (
        <DeleteUser
          open={userModalD}
          handleCloseModal={handleCloseDeleteModal}
          selectedUser={selectedUser}
          fetchData={refetch}
        />
      )}
    </div>
  );
};

export default User;
