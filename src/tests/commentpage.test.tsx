import { screen } from "@testing-library/react";
import CommentPage from "../components/commmentpage/CommentPage";
import { renderWithProviders } from "./setups/setupRedux";
import { useGetCommentQuery } from "../features/book-api/book-api-slice";
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

describe("Comment Page", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("Renders Normal Page Properly", () => {
    renderWithProviders(<CommentPage />, {
      preloadedState: {
        manager: {
          myId: "1d9011dc-ca50-46c4-97f3-5837e08bcc22",
        },
      },
    });

    expect(screen.getByText(testComment.content)).toBeInTheDocument();
    expect(screen.getAllByText(blueInfo.username).length).toEqual(2);
    expect(screen.getByText("sky")).toBeInTheDocument();
    expect(screen.getByText("Edited")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(screen.getByText("Reply")).toBeInTheDocument();
    expect(screen.getByText("Show Comments")).toBeInTheDocument();
  });

  it("shows No Post", () => {
    vi.mocked(useGetCommentQuery).mockImplementation(
      vi.fn(() => {
        return {
          error: false,
          isLoading: false,
          commentData: undefined,
        };
      }) as Mock,
    );
    renderWithProviders(<CommentPage />);
    expect(screen.getByText("No Comment Found!")).toBeInTheDocument();
  });
});
