import { screen } from "@testing-library/react";
import Requests from "../components/Requests";
import { renderWithProviders } from "./setups/setupRedux";
import {
  useGetReceivedRequestsQuery,
  useGetSentRequestsQuery,
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

describe("User Requests", () => {
  it("Renders Normal Page Properly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Requests />, {preloadedState: {
        manager: {
            myId: blueInfo.id
        }
    }});
    expect(screen.getByText("Accept")).toBeInTheDocument();
    expect(screen.getByText("Reject")).toBeInTheDocument();
    expect(
      screen.getByText(`${blueInfo.username} sent you a Follow Request`),
    ).toBeInTheDocument();
    expect(screen.getByText("Sent")).toBeInTheDocument();
    expect(screen.getByText("Received")).toBeInTheDocument();

    const sentDiv = screen.getByText("Sent");

    await user.click(sentDiv);

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(
      screen.getByText(`You sent a Follow Request to ${darkInfo.username}`),
    ).toBeInTheDocument();
  });

  describe("Renders No Results Message", () => {
    afterEach(() => {
      vi.resetAllMocks();
    });
    it("shows No Results", () => {
      vi.mocked(useGetReceivedRequestsQuery).mockImplementation(
        vi.fn(() => {
          return {
            isLoading: false,
            error: false,
            received: [],
          };
        }) as Mock,
      );
      renderWithProviders(<Requests />);
      expect(screen.getByText("No Requests Yet!")).toBeInTheDocument();
    });

    it("shows No Sent Requests", async () => {
      vi.mocked(useGetSentRequestsQuery).mockImplementation(
        vi.fn(() => {
          return {
            isLoading: false,
            error: false,
            sent: [],
          };
        }) as Mock,
      );

      const user = userEvent.setup();
      renderWithProviders(<Requests />);
      const sentDiv = screen.getByText("Sent");

      await user.click(sentDiv);
      expect(screen.getByText("No Sent Requests Yet!")).toBeInTheDocument();
    });
  });
});
