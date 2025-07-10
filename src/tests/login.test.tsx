import { screen } from "@testing-library/react";
import Login from "../components/Login";
import { renderWithProviders } from "./setups/setupRedux";

vi.mock("../features/book-api/book-api-slice");

vi.mock("react-router-dom", () => {
  return {
    useNavigate: vi.fn(),
    NavLink: <div></div>,
  };
});

describe("Loads Login Page", () => {
  it("shows basic display", () => {
    renderWithProviders(<Login />);
    expect(screen.getByText("Username:")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
