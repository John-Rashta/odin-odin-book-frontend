import { screen } from "@testing-library/react";
import SearchUsers from "../components/users/SearchUsers";
import { renderWithProviders } from "./setups/setupRedux";
import { useSearchUsersInfiniteQuery } from "../features/book-api/book-api-slice";
import { Mock } from "vitest";
import { darkInfo } from "../../util/globalTestValues";

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
  };
});

describe("Search Users Page", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("Renders Normal Page Properly", () => {
    renderWithProviders(<SearchUsers />);
    expect(screen.getByText(darkInfo.username)).toBeInTheDocument();
  });

  it("shows No Results", () => {
    vi.mocked(useSearchUsersInfiniteQuery).mockImplementation(
      vi.fn(() => {
        return {
          error: false,
          isLoading: false,
          hasNextPage: false,
          isFetchingNextPage: false,
          fetchNextPage: vi.fn,
          usersData: [],
        };
      }) as Mock,
    );
    renderWithProviders(<SearchUsers />);
    expect(screen.getByText("Try Searching!")).toBeInTheDocument();
  });
});
