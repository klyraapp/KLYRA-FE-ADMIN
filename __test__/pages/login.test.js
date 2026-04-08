import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/pages/login";

import authReducer, { login, logout } from "../../src/redux/reducers/authSlice";

jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn(),
}));

const queryClient = new QueryClient();
describe("Login", () => {
  test("Should Component render successfully!", () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );
  });

  test("Signin title", () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });
  test("Login title", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );
    const heading = screen.getByTestId("Login-heading");

    expect(heading).toHaveTextContent("Login");
  });

  test("Validates email input with required rule", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );

    const submitButton = screen.getByTestId("login-button");

    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText("Please enter your email");
    expect(errorMessage).toBeInTheDocument();
  });
  test("Validates password input with required rule", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );

    const submitButton = screen.getByTestId("login-button");

    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText("Please enter your password");
    expect(errorMessage).toBeInTheDocument();
  });

  test("Validates password input with required rule", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  test("Checkbox is not checked by default", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  test("Checkbox can be checked and unchecked", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
  test("Checkbox label is rendered and matches the provided text", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );
    const label = screen.getByText("Remember Me");
    expect(label).toBeInTheDocument();
    expect(label.textContent).toBe("Remember Me");
  });
  test("Renders the Forget Password", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );

    const text = screen.getByText("Forgot Password");
    expect(text).toBeInTheDocument();
  });

  test("Link navigates to the correct URL", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );

    const link = screen.getByText("Forgot Password");
    fireEvent.click(link);
  });

  test("Link navigates to the correct URL", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );

    const link = screen.getByText("Welcome To Our Platform!");
    fireEvent.click(link);
  });
  test("Login Button is enabled by default", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>,
    );
    const button = screen.getByTestId("login-button");
    expect(button).not.toBeDisabled();
  });

  it("should handle initial state", () => {
    const initialState = { user: null, isAuthenticated: true };
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  it("should handle login", () => {
    const user = { id: 1, username: "testUser" };
    const action = { type: login.type, payload: user };
    const state = authReducer(undefined, action);

    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should handle logout", () => {
    const initialState = {
      user: { id: 1, username: "testuser" },
      isAuthenticated: true,
    };
    const action = { type: logout.type };
    const state = authReducer(initialState, action);

    expect(state.user).toBe(null);
    expect(state.isAuthenticated).toBe(false);
  });

  it("should create an action to log in", () => {
    const user = { id: 1, username: "testuser" };
    const expectedAction = { type: login.type, payload: user };
    expect(login(user)).toEqual(expectedAction);
  });

  it("should create an action to log out", () => {
    const expectedAction = { type: logout.type };
    expect(logout()).toEqual(expectedAction);
  });
});
