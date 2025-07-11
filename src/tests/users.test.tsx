import { screen } from "@testing-library/react";
import Users from "../components/users/Users";
import { renderWithProviders } from "./setups/setupRedux";
import { useGetUsersInfiniteQuery } from "../features/book-api/book-api-slice";
import { Mock } from "vitest";
import { darkInfo } from "../../util/globalTestValues";

vi.mock("../features/book-api/book-api-slice");

vi.mock("react-router-dom", () => {
  return {
    useNavigate: vi.fn(),
    NavLink: <div></div>,
  };
});

describe("Users Page", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("Renders Normal Page Properly", () => {
    renderWithProviders(<Users />);
    expect(screen.getByText(darkInfo.username)).toBeInTheDocument();
  });

  it("shows No Results", () => {
    vi.mocked(useGetUsersInfiniteQuery).mockImplementation(
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
    renderWithProviders(<Users />);
    expect(screen.getByText("No Users Yet!")).toBeInTheDocument();
  });
});
