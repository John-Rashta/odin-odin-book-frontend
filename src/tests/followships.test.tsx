import { screen } from "@testing-library/react";
import Followships from "../components/followships/Followships";
import { renderWithProviders } from "./setups/setupRedux";
import {
  useGetFollowersInfiniteQuery,
  useGetFollowsInfiniteQuery,
} from "../features/book-api/book-api-slice";
import { Mock } from "vitest";
import userEvent from "@testing-library/user-event";
import { blueInfo, darkInfo } from "../../util/globalTestValues";

vi.mock("../features/book-api/book-api-slice");

vi.mock("react-router-dom", () => {
  return {
    useNavigate: vi.fn(),
    NavLink: <div></div>,
  };
});

describe("Your Followships", () => {
  it("Renders Normal Page Properly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Followships />);
    expect(screen.getByText(darkInfo.username)).toBeInTheDocument();

    const followersDiv = screen.getByText("Followers");

    await user.click(followersDiv);

    expect(screen.getByText(blueInfo.username)).toBeInTheDocument();
  });

  describe("Renders No Followships Message", () => {
    afterEach(() => {
      vi.resetAllMocks();
    });
    it("shows No Follows", () => {
      vi.mocked(useGetFollowsInfiniteQuery).mockImplementation(
        vi.fn(() => {
          return {
            isLoading: false,
            error: false,
            follows: [],
          };
        }) as Mock,
      );
      renderWithProviders(<Followships />);
      expect(screen.getByText("No Follows Yet!")).toBeInTheDocument();
    });

    it("shows No Followers", async () => {
      vi.mocked(useGetFollowersInfiniteQuery).mockImplementation(
        vi.fn(() => {
          return {
            isLoading: false,
            error: false,
            followers: [],
          };
        }) as Mock,
      );

      const user = userEvent.setup();
      renderWithProviders(<Followships />);
      const followersDiv = screen.getByText("Followers");

      await user.click(followersDiv);
      expect(screen.getByText("No Followers Yet!")).toBeInTheDocument();
    });
  });
});
