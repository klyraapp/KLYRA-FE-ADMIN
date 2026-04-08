import { Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import { deleteRole } from "@/api/rolesApi";
import { toast } from "react-toastify";
import { getTranslation } from "../../../translations";
import { useSelector } from "react-redux";

const DeleteRoles = ({ open, handleCloseModal, fetchData, selectedRole }) => {
  const { profileData } = useSelector((state) => state.users);

  const { mutate } = useMutation({
    mutationFn: () => deleteRole(selectedRole?.id),
  });

  const handleDelete = () => {
    mutate(null, {
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

  return (
    <Modal
      open={open}
      onOk={handleDelete}
      onCancel={handleCloseModal}
      okText={getTranslation(profileData?.userLanguage, "yes")}
      cancelText={getTranslation(profileData?.userLanguage, "no")}
    >
      <strong>
        {getTranslation(
          profileData?.userLanguage,
          "are_you_sure_to_delete_this_role?",
        )}
      </strong>
    </Modal>
  );
};

export default DeleteRoles;
