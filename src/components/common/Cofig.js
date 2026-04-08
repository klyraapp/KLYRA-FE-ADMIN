import { ConfigProvider } from "antd";

const Config = ({ theme, children }) => {
  return <ConfigProvider theme={{ ...theme }}>{children}</ConfigProvider>;
};

export default Config;
