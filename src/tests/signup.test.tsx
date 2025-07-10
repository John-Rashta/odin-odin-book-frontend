import { screen } from "@testing-library/react";
import SignUp from "../components/SignUp";
import { renderWithProviders } from "./setups/setupRedux";

vi.mock("../features/book-api/book-api-slice");

vi.mock("react-router-dom", () => {
  return {
    useNavigate: vi.fn(),
    NavLink: <div></div>,
  };
});

describe("Loads Signup Page", () => {
  it("shows basic display", () => {
    renderWithProviders(<SignUp />);
    expect(screen.getByText("Username:")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password:")).toBeInTheDocument();
    expect(screen.getByText("Sign Me Up!")).toBeInTheDocument();
  });
});
