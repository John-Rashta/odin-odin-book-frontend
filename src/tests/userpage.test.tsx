import { screen } from "@testing-library/react";
import UserPage from "../components/userpage/UserPage";
import { renderWithProviders } from "./setups/setupRedux";
import {
  useGetUserPostsInfiniteQuery,
  useGetUserQuery,
} from "../features/book-api/book-api-slice";
import { Mock } from "vitest";
import { darkInfo, testPost } from "../../util/globalTestValues";

vi.mock("../features/book-api/book-api-slice");

vi.mock("react-router-dom", () => {
  return {
    useNavigate: vi.fn(),
    NavLink: <div></div>,
    useSearchParams: vi.fn(() => {
      return [
        {
          get: vi.fn(() => "dark"),
        },
        vi.fn(),
      ];
    }),
    useLocation: vi.fn(),
  };
});

describe("User Page", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("Renders Normal Page Properly", () => {
    renderWithProviders(<UserPage />);
    expect(screen.getAllByText(darkInfo.username).length).toEqual(2);
    expect(screen.getByText(testPost.content)).toBeInTheDocument();
    expect(screen.getByText("Edited")).toBeInTheDocument();
  });

  it("shows No Posts", () => {
    vi.mocked(useGetUserPostsInfiniteQuery).mockImplementation(
      vi.fn(() => {
        return {
          error: false,
          isLoading: false,
          hasNextPage: false,
          isFetchingNextPage: false,
          fetchNextPage: vi.fn,
          postsData: [],
        };
      }) as Mock,
    );
    renderWithProviders(<UserPage />);
    expect(screen.getByText("No Posts Yet!")).toBeInTheDocument();
  });

  it("shows No User", () => {
    vi.mocked(useGetUserQuery).mockImplementation(
      vi.fn(() => {
        return {
          error: false,
          isLoading: false,
          user: undefined,
        };
      }) as Mock,
    );
    renderWithProviders(<UserPage />);
    expect(screen.getByText("No User Found!")).toBeInTheDocument();
  });

  it("Shows Loading Posts", () => {
    vi.mocked(useGetUserPostsInfiniteQuery).mockImplementation(
      vi.fn(() => {
        return {
          error: false,
          isLoading: true,
          hasNextPage: false,
          isFetchingNextPage: false,
          fetchNextPage: vi.fn,
          postsData: [],
        };
      }) as Mock,
    );
    renderWithProviders(<UserPage />);
    expect(screen.getByText("Loading Posts...")).toBeInTheDocument();
  });

  it("Shows Error Post", () => {
    vi.mocked(useGetUserPostsInfiniteQuery).mockImplementation(
      vi.fn(() => {
        return {
          error: true,
          isLoading: false,
          hasNextPage: false,
          isFetchingNextPage: false,
          fetchNextPage: vi.fn,
          postsData: [],
        };
      }) as Mock,
    );
    renderWithProviders(<UserPage />);
    expect(screen.getByText("Failed Loading Posts!")).toBeInTheDocument();
  });

  it("Shows Loading User", () => {
    vi.mocked(useGetUserQuery).mockImplementation(
      vi.fn(() => {
        return {
          error: false,
          isLoading: true,
          user: undefined,
        };
      }) as Mock,
    );
    renderWithProviders(<UserPage />);
    expect(screen.getByText("Loading User...")).toBeInTheDocument();
  });

  it("Shows Error User", () => {
    vi.mocked(useGetUserQuery).mockImplementation(
      vi.fn(() => {
        return {
          error: true,
          isLoading: false,
          user: undefined,
        };
      }) as Mock,
    );
    renderWithProviders(<UserPage />);
    expect(screen.getByText("Can't Find User.")).toBeInTheDocument();
  });
});
