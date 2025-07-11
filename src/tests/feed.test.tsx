import { screen } from "@testing-library/react";
import Feed from "../components/homepage/Feed";
import { renderWithProviders } from "./setups/setupRedux";
import { useGetFeedInfiniteQuery } from "../features/book-api/book-api-slice";
import { Mock } from "vitest";
import { testPost } from "../../util/globalTestValues";

vi.mock("../features/book-api/book-api-slice");

vi.mock("react-router-dom", () => {
  return {
    useNavigate: vi.fn(),
    NavLink: <div></div>,
  };
});

describe("Feed Page", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("Renders Normal Page Properly", () => {
    renderWithProviders(<Feed />);
    expect(screen.getByText(testPost.creator.username)).toBeInTheDocument();
    expect(screen.getByText(testPost.content)).toBeInTheDocument();
    expect(screen.getByText("Edited")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("shows No Results", () => {
    vi.mocked(useGetFeedInfiniteQuery).mockImplementation(
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
    renderWithProviders(<Feed />);
    expect(screen.getByText("No Feed Yet!")).toBeInTheDocument();
  });
});
