import ForgotPassword from "@/pages/forgot-password";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import configureStore from "redux-mock-store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { useMutation } from "@tanstack/react-query";
import { userEvent } from "@testing-library/user-event";

const queryClient = new QueryClient();
const mockStore = configureStore([]);
const mockDispatch = jest.fn();

// Mock the useRouter function
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@tanstack/react-query");

describe("Forgot password", () => {
  it("handles form submission successfully", async () => {
    const mockedMutate = jest.fn(() => Promise.resolve());
    useMutation.mockReturnValue({ mutate: mockedMutate, isLoading: false });

    const mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    render(<ForgotPassword />);

    // Fill out the form and submit
    const emailInput = screen.getByPlaceholderText("Email");
    userEvent.type(emailInput, "test@example.com");

    const submitButton = screen.getByText("Send Reset Link");
    userEvent.click(submitButton);

    //    await waitFor(()=>{
    //         expect(screen.getByText('Password reset email sent successfully.')).toBeInTheDocument()
    //     })
  });

  test("Should Forgot password Component render successfully!", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ForgotPassword />
      </QueryClientProvider>,
    );
  });

  test("Forgot Password and Emmail text show", () => {
    render(<ForgotPassword />);
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  test("displays error message when submitting with empty email", async () => {
    render(<ForgotPassword />);

    fireEvent.click(screen.getByText("Send Reset Link"));

    await waitFor(() => {
      expect(screen.getByText("Please enter your email")).toBeInTheDocument();
    });
  });

  test("Go Back to Login button", () => {
    render(<ForgotPassword />);

    const loginButton = screen.getByRole("link", { name: "Go Back to Login" });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute("href", "/login");
  });
});
