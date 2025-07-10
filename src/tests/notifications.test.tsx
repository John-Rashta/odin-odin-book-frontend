import { screen } from "@testing-library/react";
import Notifications from "../components/Notifications";
import { renderWithProviders } from "./setups/setupRedux";
import { useGetNotificationsQuery } from "../features/book-api/book-api-slice";
import { Mock } from "vitest";

vi.mock("../features/book-api/book-api-slice");

vi.mock("react-router-dom", () => {
  return {
    useNavigate: vi.fn(),
    NavLink: <div></div>,
  };
});

describe("Notifications Page", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("Renders Normal Page Properly", () => {
    renderWithProviders(<Notifications />);
    expect(screen.getByText("followsent")).toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
  });

   it("shows No Results", () => {
        vi.mocked(useGetNotificationsQuery).mockImplementation(
          vi.fn(() => {
            return {
              isLoading: false,
              error: false,
              received: [],
            };
          }) as Mock,
        );
        renderWithProviders(<Notifications />);
        expect(screen.getByText("No Notifications Yet!")).toBeInTheDocument();
      });
});