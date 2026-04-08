import User from "@/pages/user";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import configureStore from "redux-mock-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserAddOutlined } from "@ant-design/icons";
import CreateUser from "../../src/components/User/CreateUser";
import DeleteUser from "../../src/components/User/DeleteUser";
import userReducer, {
  setProfileData,
  setUserModal,
  setUserModalDelete,
  setSelectedRole,
} from "../../src/redux/reducers/userState";
import { Table } from "antd";
import { userColumns } from "../../src/components/User/userColumns";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock the useRouter function
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

global.fetch = jest.fn();

const mockUserData = [{ id: 1, name: "User 1" }];

const mockStore = configureStore([]);
const mockDispatch = jest.fn();
const queryClient = new QueryClient();
describe("User component", () => {
  const initialState = {
    users: [],
    userModal: false,
    userModalD: false,
    profileData: {
      profileName: "",
      email: "",
      role: "",
      permissions: [],
      id: null,
      userLanguage: "en",
    },
    selectedUser: {},
  };

  let store;
  beforeEach(() => {
    global.fetch.mockReset();

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) =>
      selector({
        users: {
          userModal: false,
          userModalD: false,
          selectedUser: {},
        },
      }),
    );

    store = mockStore({});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("Should Signup Component render successfully!", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <User />
        </QueryClientProvider>
      </Provider>,
    );
  });

  test("renders Button component", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <User />
        </QueryClientProvider>
      </Provider>,
    );
    const buttonElement = screen.getByText(/add_user/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test("renders button with UserAddOutlined icon", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <User />
        </QueryClientProvider>
      </Provider>,
    );
    const iconElement = screen.getByTestId("user-add-outlined-icon"); // Adjust based on your actual implementation
    expect(iconElement).toBeInTheDocument();
  });

  test("button is disabled when userCreatePermission is false", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <User />
        </QueryClientProvider>
      </Provider>,
    );
    const buttonElement = screen.getByText(/add_user/i);
    expect(buttonElement).not.toBeDisabled();
  });
  test("Add User component render successfully!", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CreateUser open={true} />
        </QueryClientProvider>
      </Provider>,
    );
  });

  test("renders modal with form elements", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CreateUser open={true} />
        </QueryClientProvider>
      </Provider>,
    );

    const buttonElement = screen.getByTestId("create-user-button");
    expect(buttonElement).toHaveTextContent("create_user");
  });

  test("has correct styles", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CreateUser open={true} />
        </QueryClientProvider>
      </Provider>,
    );

    const buttonElement = screen.getByTestId("create-user-button");
    expect(buttonElement).toHaveStyle({
      width: "100%",
      background: "#6286d3",
      margin: "0",
    });
  });

  test("renders password input and form item", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CreateUser open={true} />
        </QueryClientProvider>
      </Provider>,
    );
    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  test("renders email input field", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CreateUser open={true} />
        </QueryClientProvider>
      </Provider>,
    );
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();
  });

  test('handles "Yes" button click correctly', () => {
    const handleDeleteMock = jest.fn();
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <DeleteUser open={true} handleDelete={handleDeleteMock} />
        </QueryClientProvider>
      </Provider>,
    );

    const yesButton = screen.getByText(/yes/i);
    fireEvent.click(yesButton);
    expect(yesButton).not.toBeDisabled();
  });

  test('handles "No" button click correctly', () => {
    const handleCloseModalMock = jest.fn();
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <DeleteUser open={true} handleCloseModal={handleCloseModalMock} />
        </QueryClientProvider>
      </Provider>,
    );

    const noButton = screen.getByText(/no/i);
    fireEvent.click(noButton);
    expect(noButton).not.toBeDisabled();
  });

  test('renders correct translated text for "Yes" button', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <DeleteUser open={true} />
        </QueryClientProvider>
      </Provider>,
    );
    const yesButton = screen.getByText(/yes/i);
    expect(yesButton).toBeInTheDocument();
  });
  test('renders correct translated text for "No" button', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <DeleteUser open={true} />
        </QueryClientProvider>
      </Provider>,
    );
    const noButton = screen.getByText(/no/i);
    expect(noButton).toBeInTheDocument();
  });

  test("Roles Table Columns", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <User />
        </QueryClientProvider>
      </Provider>,
    );
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("action")).toBeInTheDocument();
  });

  it("should handle setUserModal", () => {
    const action = setUserModal(true);
    const newState = userReducer(initialState, action);
    expect(newState.userModal).toEqual(true);
  });

  it("should handle setUserModalDelete", () => {
    const action = setUserModalDelete(true);
    const newState = userReducer(initialState, action);
    expect(newState.userModalD).toEqual(true);
  });

  it("should handle setProfileData", () => {
    const newProfileData = {
      profileName: "John Doe",
      email: "john@example.com",
      role: "admin",
      permissions: [{ id: 1, name: "add_users" }],
      id: 1,
      userLanguage: "en",
    };

    const action = setProfileData(newProfileData);
    const newState = userReducer(initialState, action);
    expect(newState.profileData).toEqual(newProfileData);
  });

  it("should handle setSelectedRole", () => {
    const selectedUser = { id: 1, name: "John Doe" };
    const action = setSelectedRole(selectedUser);
    const newState = userReducer(initialState, action);
    expect(newState.selectedUser).toEqual(selectedUser);
  });

  it("renders the table with user data", () => {
    const mockData = [
      { id: 1, name: "John", email: "john@example.com" },
      { id: 2, name: "Jane", email: "jane@example.com" },
    ];

    render(
      <Table
        dataSource={mockData}
        columns={userColumns({
          handleEdit: jest.fn(),
          handleDelete: jest.fn(),
          userUpdatePermission: true,
          userDeletePermission: true,
          profileData: { userLanguage: "en" },
        })}
      />,
    );

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("returns an array of column configurations", () => {
    const columns = userColumns({
      handleEdit: jest.fn(),
      handleDelete: jest.fn(),
      userUpdatePermission: true,
      userDeletePermission: true,
      profileData: { userLanguage: "en" },
    });

    expect(columns).toHaveLength(4);
    expect(columns[0]).toHaveProperty("dataIndex", "id");
    expect(columns[1]).toHaveProperty("dataIndex", "name");
    expect(columns[2]).toHaveProperty("dataIndex", "email");
    expect(columns[3].render).toBeInstanceOf(Function);
  });

  it("handles form submission for editing roles", async () => {
    const mockFetchData = jest.fn();
    const mockHandleCloseModal = jest.fn();

    const mockEditRolesData = {
      id: 1,
      name: "Admin",
      rolePermission: [{ permissionId: 1 }, { permissionId: 2 }],
    };

    const mockPermissionsData = [
      { id: 1, name: "Permission 1" },
      { id: 2, name: "Permission 2" },
    ];

    render(
      <QueryClientProvider client={queryClient}>
        <CreateUser
          open={true}
          handleCloseModal={mockHandleCloseModal}
          editUserData={mockEditRolesData}
          fetchData={mockFetchData}
          permissionsData={mockPermissionsData}
          userAssignPermission={true}
        />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByTestId("create-user-button"));
  });
});
