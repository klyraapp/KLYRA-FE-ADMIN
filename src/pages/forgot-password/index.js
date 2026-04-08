import { Button, Form, Input, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";

import { forgotPassword } from "@/api/authApi/index";

const ForgotPassword = () => {
  const { mutate, isLoading } = useMutation({ mutationFn: forgotPassword });

  const onFinish = (formData) => {
    const data = {
      email: formData?.email,
    };

    mutate(data, {
      onSuccess: () => {
        message.success("Password reset email sent successfully.");
      },
      onError: (err) => {
        message.error(err?.response?.data?.msg || "An error occurred");
      },
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Forgot Password</h1>
      <p style={{ textAlign: "center", paddingBottom: "40px" }} data-testid>
        Enter your email to reset your password
      </p>
      <Form name="forgot-password" onFinish={onFinish}>
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
        <Form.Item>
          <Button
            style={{ width: "100%", background: "#4f7fcd" }}
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            Send Reset Link
          </Button>
          <div style={{ textAlign: "center" }}>
            <Link href="/login" style={{ color: "black" }}>
              Go Back to Login
            </Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;

ForgotPassword.getLayout = function (page) {
  return <>{page}</>;
};
