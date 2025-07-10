import { screen } from "@testing-library/react";
import PasswordEdit from "../components/PasswordEdit";
import { renderWithProviders } from "./setups/setupRedux";

vi.mock("../features/book-api/book-api-slice");

vi.mock("react-router-dom", () => {
  return {
    useNavigate: vi.fn(),
    NavLink: <div></div>,
  };
});

describe("Loads Password Edit Page", () => {
  it("shows basic display", () => {
    renderWithProviders(<PasswordEdit />);
    expect(screen.getByText("Current Password:")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password:")).toBeInTheDocument();
    expect(screen.getByText("Change Password")).toBeInTheDocument();
  });
});
