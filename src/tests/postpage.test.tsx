import { screen } from "@testing-library/react";
import PostPage from "../components/postpage/PostPage";
import { renderWithProviders } from "./setups/setupRedux";
import {
  useGetPostCommentsInfiniteQuery,
  useGetPostQuery,
} from "../features/book-api/book-api-slice";
import { Mock } from "vitest";
import { blueInfo, testComment } from "../../util/globalTestValues";

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

describe("Post Page", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("Renders Normal Page Properly", () => {
    renderWithProviders(<PostPage />, {
      preloadedState: {
        manager: {
          myId: "1d9011dc-ca50-46c4-97f3-5837e08bcc22",
        },
      },
    });

    expect(screen.getByText(testComment.content)).toBeInTheDocument();
    expect(screen.getAllByText(blueInfo.username).length).toEqual(2);
    expect(screen.getByText("Goodnight")).toBeInTheDocument();
    expect(screen.getAllByText("Edited").length).toEqual(2);
    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(screen.getByText("Reply")).toBeInTheDocument();
    expect(screen.getByText("Show Comments")).toBeInTheDocument();
  });

  it("shows No Comments", () => {
    vi.mocked(useGetPostCommentsInfiniteQuery).mockImplementation(
      vi.fn(() => {
        return {
          error: false,
          isLoading: false,
          hasNextPage: false,
          isFetchingNextPage: false,
          fetchNextPage: vi.fn,
          commentsData: [],
        };
      }) as Mock,
    );
    renderWithProviders(<PostPage />);
    expect(screen.getByText("No Comments Yet!")).toBeInTheDocument();
  });

  it("shows No Post", () => {
    vi.mocked(useGetPostQuery).mockImplementation(
      vi.fn(() => {
        return {
          error: false,
          isLoading: false,
          post: undefined,
        };
      }) as Mock,
    );
    renderWithProviders(<PostPage />);
    expect(screen.getByText("No Post Found!")).toBeInTheDocument();
  });
});
