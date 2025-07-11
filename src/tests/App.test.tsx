import { RouterProvider, createMemoryRouter } from "react-router";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./setups/setupRedux";
import routes from "../routes";
import { useGetSelfQuery } from "../features/book-api/book-api-slice";
import { Mock } from "vitest";
import { testDate, testPost } from "../../util/globalTestValues";

vi.mock("../features/book-api/book-api-slice");

vi.mock("../../sockets/socket", () => {
  return {
    socket: {
      connect: vi.fn(),
      disconnect: vi.fn(),
    },
  };
});

describe("Layout", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("App matches snapshot", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    const { container } = renderWithProviders(
      <RouterProvider router={router} />,
    );
    expect(container).toMatchSnapshot();
  });
  it("renders default layout with header and footer", () => {
    vi.mocked(useGetSelfQuery).mockImplementation(
      vi.fn(() => {
        return {
          isLoading: false,
          error: true,
          data: undefined,
        };
      }) as Mock,
    );
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    renderWithProviders(<RouterProvider router={router} />);

    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(
      screen.getByText("Project for The Odin Project"),
    ).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Welcome to Odin Book!")).toBeInTheDocument();
  });

  it("renders guest layout", () => {
    vi.mocked(useGetSelfQuery).mockImplementation(
      vi.fn(() => {
        return {
          isLoading: false,
          error: true,
          data: undefined,
        };
      }) as Mock,
    );
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    renderWithProviders(<RouterProvider router={router} />, {
      preloadedState: {
        manager: {
          myId: "guest",
        },
        auth: {
          loggedIn: true,
        },
      },
    });

    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(
      screen.getByText("Project for The Odin Project"),
    ).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("Guest Page")).toBeInTheDocument();
  });

  it("renders basic layout when logged in", () => {
    vi.mocked(useGetSelfQuery).mockImplementation(
      vi.fn(() => {
        return {
          isLoading: false,
          error: false,
          data: {
            user: {
              id: "1d9011dc-ca50-46c4-97f3-5837e08bcc22",
              iconid: 2,
              username: "redeyes",
              aboutMe: "hello",
              joinedAt: testDate,
              icon: {
                id: 2,
                source: "ASFAS",
              },
              customIcon: null,
              followerCount: 2,
            },
          },
        };
      }) as Mock,
    );

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    renderWithProviders(<RouterProvider router={router} />);

    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(
      screen.getByText("Project for The Odin Project"),
    ).toBeInTheDocument();
    expect(screen.getByText("Notifications 1")).toBeInTheDocument();
    expect(screen.getByText("Requests")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Followships")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("MyPosts")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText(testPost.creator.username)).toBeInTheDocument();
    expect(screen.getByText(testPost.content)).toBeInTheDocument();
    expect(screen.getByText("Edited")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });
});
