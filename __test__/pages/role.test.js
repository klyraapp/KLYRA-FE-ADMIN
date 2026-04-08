import Roles from "@/pages/roles";
import {
  fireEvent,
  getAllByTestId,
  queryAllByTestId,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import configureStore from "redux-mock-store";
import { userEvent } from "@testing-library/user-event";
import CreateRoles from "../../src/components/Roles/CreateRole";
import DeleteRoles from "../../src/components/Roles/DeleteRoles";
import rolesReducer, {
  setRolesModal,
  setRolesModalDelete,
  setSelectedRole,
} from "../../src/redux/reducers/rolesState";
import { Table } from "antd";
import { roleColumns } from "../../src/components/Roles/roleColumns";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

const mockStore = configureStore([]);
const mockDispatch = jest.fn();
const queryClient = new QueryClient();
describe("Role", () => {
  let store;
  const handleOpenModalMock = jest.fn();
  beforeEach(() => {
    handleOpenModalMock.mockClear();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) =>
      selector({ roles: {}, users: {} }),
    );

    store = mockStore({});
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should Role component renders successfully!", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Roles />
        </QueryClientProvider>
      </Provider>,
    );
  });

  test("should Role component renders successfully!", async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Roles />
        </QueryClientProvider>
      </Provider>,
    );
    await expect(screen.getByText("add_roles")).toBeInTheDocument();
  });

  test("should Role component renders successfully!", async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Roles />
        </QueryClientProvider>
      </Provider>,
    );
    const addButton = screen.getByRole("button", { name: /add_roles/i });
    expect(addButton).toBeInTheDocument();
  });

  test("button is disabled when roleCreatePermission is false", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Roles />
        </QueryClientProvider>
      </Provider>,
    );
    const addButton = screen.getByRole("button", { name: /add_roles/i });
    expect(addButton).toBeDisabled();
  });

  test("create role title", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CreateRoles open={true} />
        </QueryClientProvider>
      </Provider>,
    );
    expect(screen.getByText("create_roles")).toBeInTheDocument();
  });

  test("Select all text for selecting all permissions", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CreateRoles open={true} />
        </QueryClientProvider>
      </Provider>,
    );
    expect(screen.getByText("Select All")).toBeInTheDocument();
  });

  test("Roles Table Columns", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Roles />
        </QueryClientProvider>
      </Provider>,
    );
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText("roles")).toBeInTheDocument();
    expect(screen.getByText("created_at")).toBeInTheDocument();
    expect(screen.getByText("updated_at")).toBeInTheDocument();
    expect(screen.getByText("action")).toBeInTheDocument();
  });
  test("Create Role Button", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CreateRoles open={true} />
        </QueryClientProvider>
      </Provider>,
    );
    const button = getByTestId("role-create-button");
    expect(button).toHaveTextContent(/create_role/i);
  });
  test("Create Role Button", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <DeleteRoles open={true} />
        </QueryClientProvider>
      </Provider>,
    );
    expect(
      screen.getByText("are_you_sure_to_delete_this_role?"),
    ).toBeInTheDocument();
  });

  test('handles "Yes" button click correctly', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <DeleteRoles open={true} />
        </QueryClientProvider>
      </Provider>,
    );

    const yesButton = screen.getByText(/yes/i);
    fireEvent.click(yesButton);
    expect(yesButton).not.toBeDisabled();
  });

  test('handles "No" button click correctly', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <DeleteRoles open={true} />
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
          <DeleteRoles open={true} />
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
          <DeleteRoles open={true} />
        </QueryClientProvider>
      </Provider>,
    );
    const noButton = screen.getByText(/no/i);
    expect(noButton).toBeInTheDocument();
  });

  test("renders name of the role", () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CreateRoles open={true} />
        </QueryClientProvider>
      </Provider>,
    );
    expect(getByPlaceholderText("Name")).toBeInTheDocument();
  });

  test("Create Role form validation", async () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CreateRoles open={true} />
        </QueryClientProvider>
      </Provider>,
    );

    const submitButton = screen.getByTestId("role-create-button");

    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText("Please enter your name");
    expect(errorMessage).toBeInTheDocument();
  });

  it("should handle setRolesModal", () => {
    const initialState = { rolesModal: false };
    const newState = rolesReducer(initialState, setRolesModal(true));
    expect(newState.rolesModal).toEqual(true);
  });

  it("should handle setRolesModalDelete", () => {
    const initialState = { rolesModalD: false };
    const newState = rolesReducer(initialState, setRolesModalDelete(true));
    expect(newState.rolesModalD).toEqual(true);
  });

  it("should handle setSelectedRole", () => {
    const initialState = { selectedRole: {} };
    const newSelectedRole = { name: "Admin", permissions: ["read", "write"] };

    const newState = rolesReducer(
      initialState,
      setSelectedRole(newSelectedRole),
    );
    expect(newState.selectedRole).toEqual(newSelectedRole);
  });

  it("renders the table with user data", () => {
    const mockData = [
      {
        id: 1,
        name: "Admin",
        createdAt: "12/10/2022",
        updatedAt: "12/11/2022",
      },
    ];

    render(
      <Table
        dataSource={mockData}
        columns={roleColumns({
          handleEdit: jest.fn(),
          handleDelete: jest.fn(),
          userUpdatePermission: true,
          userDeletePermission: true,
          profileData: { userLanguage: "en" },
        })}
      />,
    );

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("12/10/2022")).toBeInTheDocument();
    expect(screen.getByText("12/11/2022")).toBeInTheDocument();
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
        <CreateRoles
          open={true}
          handleCloseModal={mockHandleCloseModal}
          editRolesData={mockEditRolesData}
          fetchData={mockFetchData}
          permissionsData={mockPermissionsData}
        />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByTestId("role-create-button"));

    await waitFor(() => {
      expect(mockHandleCloseModal).toHaveBeenCalledTimes(1);
    });
  });
});
