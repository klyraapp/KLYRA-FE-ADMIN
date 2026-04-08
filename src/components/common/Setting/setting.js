import { Typography, Radio, List } from "antd";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateUser } from "@/api/userApi";
import { setProfileData } from "@/redux/reducers/userState";
import { getTranslation } from "../../../../translations";

const { Title } = Typography;

const ThemeSetting = () => {
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.users);

  const [selectedItem, setSelectedItem] = useState(profileData?.userLanguage);

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: (data) => updateUser(profileData?.id, data),
  });

  const handleRadioChange = (item) => {
    const data = {
      languagePreference: item,
    };
    mutateUpdate(data, {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
        setSelectedItem(item);
        dispatch(setProfileData({ ...profileData, userLanguage: item }));
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message);
      },
    });
  };

  const items = [
    {
      value: "en",
      label: getTranslation(profileData?.userLanguage, "english"),
    },
    { value: "ar", label: getTranslation(profileData?.userLanguage, "arabic") },
  ];

  return (
    <>
      <div>
        <Title level={5}>
          {getTranslation(
            profileData?.userLanguage,
            "please_select_your_language",
          )}
        </Title>
        <Radio.Group
          onChange={(e) => handleRadioChange(e.target.value)}
          value={selectedItem}
        >
          <List
            dataSource={items}
            renderItem={(item) => (
              <List.Item>
                <Radio value={item.value}>{item.label}</Radio>
              </List.Item>
            )}
          />
        </Radio.Group>
      </div>
    </>
  );
};

export default ThemeSetting;
