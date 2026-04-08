import { userLogin } from "@/api/authApi";
import Config from "@/components/common/Cofig";
import { buttonTheme } from "@/features/auth";
import { CREATE_USER } from "@/graphQlQueries/authQueries";
import { setCookie } from "@/utils/utils";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { GoogleLogin } from "@react-oauth/google";
import { Button, Checkbox, Col, Form, Input, message, Row } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

// import { useMutation as apolloUseMutation } from "@apollo/client/react/hooks";
import { useMutation as reactQueryUseMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getTranslation } from "../../../translations";

function CreateAcc() {
  const router = useRouter();
  const { profileData } = useSelector((state) => state.users);
  const [createUser, { loading }] = apolloUseMutation(CREATE_USER);

  const { mutate: mutateGoogle } = reactQueryUseMutation({
    mutationFn: userLogin,
  });

  const onFinish = async (formData) => {
    const userData = {
      email: formData?.email,
      name: formData?.username,
      password: formData?.password,
    };
    try {
      const response = await createUser({
        variables: { userData },
      });
      message.success(response?.data?.message);
      router.push("/login");
    } catch (error) {
      console.error("Error creating user:", error);
      message.error(error?.response?.data?.message);
    }
  };

  const onGoogleRegister = (credentialResponse) => {
    let decoded = jwt_decode(credentialResponse?.credential);

    const userGoogleData = {
      name: decoded?.given_name,
      email: decoded?.email,
      socialId: decoded?.sub,
      is_active: decoded?.email_verified,
      socialProvider: "google",
    };

    mutateGoogle(userGoogleData, {
      onSuccess: (response) => {
        message.success("Signup Successfully");
        setCookie("refresh_token", response?.data?.refresh_token);
        setCookie("access_token", response?.data?.access_token);
        router.push("/");
      },
      onError: (err) => {
        message.success(err?.response?.data?.message);
      },
    });
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={24} sm={12}>
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Create Account</h1>
          <p style={{ textAlign: "center", paddingBottom: "40px" }}>
            Register Your Account
          </p>
          <Form name="CreateAccount" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input
                style={{ padding: "10px" }}
                placeholder="Email"
                suffix={<MailOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input
                style={{ padding: "10px" }}
                placeholder="Username"
                suffix={<UserOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                style={{ padding: "10px" }}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <GoogleLogin
                onSuccess={onGoogleRegister}
                type="standard"
                theme="outline"
                size="large"
                shape="rectangular"
                width={"450px"}
                logo_alignment="center"
                prompt={"select_account"}
                text={"signup_with"}
                useOneTap
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </Form.Item>
            <Form.Item>
              <Config theme={buttonTheme}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox>Remember me</Checkbox>
                    <div style={{ margin: "0 82px" }}></div>
                    <Link href="/forgot-password" style={{ color: "black" }}>
                      Forgot Password
                    </Link>
                  </div>
                  <Button
                    style={{ width: "100%", background: "#4F7FCD" }}
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    data-testid="create-account-button"
                  >
                    Create Account
                  </Button>
                  <Link href="/login" style={{ color: "black" }}>
                    Already have an account? Login
                  </Link>
                </div>
              </Config>
            </Form.Item>
          </Form>
        </div>
      </Col>
      <Col
        xs={24}
        sm={12}
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(to left, rgb(79 99 133), rgb(74 107 227))",
          borderBottomLeftRadius: "50%",
          borderTopLeftRadius: "50%",
        }}
      >
        <div style={{ marginTop: "-25px" }}>
          <h1>
            {getTranslation(
              profileData?.userLanguage,
              "welcome_to_our_platform!",
            )}
          </h1>
          <p style={{ textAlign: "center" }}>
            Learn more about our services or contact us.
          </p>
        </div>
      </Col>
    </Row>
  );
}

export default CreateAcc;

CreateAcc.getLayout = function (page) {
  return <>{page}</>;
};
