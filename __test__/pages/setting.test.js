import Setting from "@/pages/setting";
import { render, screen } from "@testing-library/react";
import { Provider, useDispatch, useSelector } from "react-redux";
import configureStore from "redux-mock-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  getPermissionEnum,
  checkUserAssignPermissions,
  deleteCookie,
  setCookie,
} from "../../src/utils/utils";
import { PERMISSIONS } from "../../src/utils/constant";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockStore = configureStore([]);
const mockDispatch = jest.fn();
const queryClient = new QueryClient();
describe("Setting", () => {
  let store;
  beforeEach(() => {
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

  test("Should setting component render successfully!", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Setting />
        </QueryClientProvider>
      </Provider>,
    );
  });

  test("renders the title with correct translation", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Setting />
        </QueryClientProvider>
      </Provider>,
    );
    const titleElement = screen.getByRole("heading", { level: 3 });
    expect(titleElement).toHaveTextContent(/settings/i);
  });

  test("renders the sub-title with correct translation", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Setting />
        </QueryClientProvider>
      </Provider>,
    );
    const subTitleElement = screen.getByRole("heading", { level: 5 });
    expect(subTitleElement).toHaveTextContent(/please_select_your_language/i);
  });

  test("renders radio buttons with correct values and labels", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Setting />
        </QueryClientProvider>
      </Provider>,
    );

    expect(screen.getByText("arabic")).toBeInTheDocument();
    expect(screen.getByText("english")).toBeInTheDocument();
  });

  it("returns correct permission value from permissionMap", () => {
    expect(getPermissionEnum(PERMISSIONS.ADD_USERS)).toBe("Add User");
    expect(getPermissionEnum("NonExistentPermission")).toBe(
      "NonExistentPermission",
    ); // Default case
  });

  const mockPermissions = [
    { name: PERMISSIONS.ADD_USERS },
    { name: PERMISSIONS.EDIT_USERS },
  ];

  it("returns true if permission exists in the array", () => {
    expect(
      checkUserAssignPermissions(PERMISSIONS.ADD_USERS, mockPermissions),
    ).toBe(true);
    expect(
      checkUserAssignPermissions("NonExistentPermission", mockPermissions),
    ).toBe(false);
  });

  test("deletes the specified cookie", () => {
    document.cookie = "your=example;path=/;";

    deleteCookie("your");

    expect(document.cookie.includes("your=")).toBe(false);
  });

  test("sets a new cookie", () => {
    setCookie("your", "example");

    expect(document.cookie.includes("your=example")).toBe(true);
  });
});
