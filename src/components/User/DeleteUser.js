import { Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "@/api/userApi/index";
import { toast } from "react-toastify";
import { getTranslation } from "../../../translations";
import { useSelector } from "react-redux";

const DeleteUser = ({ open, handleCloseModal, fetchData, selectedUser }) => {
  const { profileData } = useSelector((state) => state.users);

  const { mutate } = useMutation({
    mutationFn: () => deleteUser(selectedUser?.id),
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
          "are_you_sure_to_delete_this_user?",
        )}
      </strong>
    </Modal>
  );
};

export default DeleteUser;
