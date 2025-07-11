import { screen } from "@testing-library/react";
import Self from "../components/yourpages/Self";
import { renderWithProviders } from "./setups/setupRedux";
import { darkInfo } from "../../util/globalTestValues";

vi.mock("../features/book-api/book-api-slice");

vi.mock("react-router-dom", () => {
  return {
    useNavigate: vi.fn(),
    NavLink: <div></div>,
  };
});

describe("My Self", () => {
  it("Renders Normal Page Properly", () => {
    renderWithProviders(<Self />);
    expect(screen.getByText(`User ID: ${darkInfo.id}`)).toBeInTheDocument();
    expect(screen.getByText(darkInfo.username)).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("Icons")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });
});
