import { useRouter } from "next/router";
import { Button, Form, Input, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/api/authApi/index";

function ResetPassword() {
  const router = useRouter();
  const { token } = router?.query;
  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => resetPassword(token, data),
  });

  const onFinish = (formData) => {
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      message.error("Passwords do not match.");

      return;
    }

    const data = {
      password,
    };

    mutate(data, {
      onSuccess: () => {
        message.success("Password reset successfully.");
        router.push("/login");
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
      <h1 style={{ textAlign: "center" }}>Reset Password</h1>
      <p style={{ textAlign: "center", paddingBottom: "40px" }}>
        Enter your new password
      </p>
      <Form name="reset-password" onFinish={onFinish}>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please enter your new password" },
          ]}
        >
          <Input.Password
            style={{ padding: "10px" }}
            placeholder="New Password"
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your password" }]}
        >
          <Input.Password
            style={{ padding: "10px" }}
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: "100%", background: "#4f7fcd" }}
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ResetPassword;

ResetPassword.getLayout = function (page) {
  return <>{page}</>;
};
