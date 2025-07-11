import { screen } from "@testing-library/react";
import YourPosts from "../components/yourpages/YourPosts";
import { renderWithProviders } from "./setups/setupRedux";
import { useGetMyPostsInfiniteQuery } from "../features/book-api/book-api-slice";
import { Mock } from "vitest";
import { testPost } from "../../util/globalTestValues";

vi.mock("../features/book-api/book-api-slice");

vi.mock("react-router-dom", () => {
  return {
    useNavigate: vi.fn(),
    NavLink: <div></div>,
  };
});

describe("MyPosts Page", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("Renders Normal Page Properly", () => {
    renderWithProviders(<YourPosts />);
    expect(screen.getByText(testPost.creator.username)).toBeInTheDocument();
    expect(screen.getByText(testPost.content)).toBeInTheDocument();
    expect(screen.getByText("Edited")).toBeInTheDocument();
  });

  it("shows No Results", () => {
    vi.mocked(useGetMyPostsInfiniteQuery).mockImplementation(
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
    renderWithProviders(<YourPosts />);
    expect(screen.getByText("No Posts Yet!")).toBeInTheDocument();
  });
});
