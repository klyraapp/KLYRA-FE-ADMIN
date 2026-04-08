import Profile from "@/pages/profile";
import { render, screen } from "@testing-library/react";
import { Provider, useDispatch, useSelector } from "react-redux";
import configureStore from "redux-mock-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockStore = configureStore([]);
const mockDispatch = jest.fn();
const queryClient = new QueryClient();
describe("Profile", () => {
  let store;
  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) =>
      selector({
        users: {
          profileData: {
            userLanguage: "en",
            profileName: "John Doe",
            email: "john.doe@example.com",
            role: [{ role: { name: "Admin" } }],
            permissions: [{ name: "READs" }],
          },
        },
      }),
    );

    store = mockStore({});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should profile component render successfully!", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Profile />
        </QueryClientProvider>
      </Provider>,
    );
  });

  test("User profile heading", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Profile />
        </QueryClientProvider>
      </Provider>,
    );
    expect(screen.getByText(/User Profile/i)).toBeInTheDocument();
  });

  it("renders  email correctly", () => {
    render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    );

    expect(screen.getByText(/Email/i)).toBeInTheDocument();
  });

  it("renders role and permission tags correctly", () => {
    render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    );

    // Check if the role and permission tags are rendered correctly
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Read/i)).toBeInTheDocument();
  });
});
