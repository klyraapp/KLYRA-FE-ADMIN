import { userLogout } from "@/api/authApi";
import { logout } from "@/redux/reducers/authSlice";
import { deleteCookie } from "@/utils/utils";
import { LogoutOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getTranslation } from "../../../translations";

function LogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mutate } = useMutation({ mutationFn: userLogout });
  const { profileData } = useSelector((state) => state.users);

  const handleLogout = () => {
    mutate(null, {
      onSuccess: () => {
        dispatch(logout());
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        localStorage.removeItem("rememberedEmail");
        router.push("/login");
      },
      onError: () => {
        dispatch(logout());
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        localStorage.removeItem("rememberedEmail");
        router.push("/login");
      },
    });
  };

  return (
    <div onClick={handleLogout}>
      <LogoutOutlined />
      {getTranslation(profileData?.userLanguage, "logout")}
    </div>
  );
}

export default LogoutButton;
