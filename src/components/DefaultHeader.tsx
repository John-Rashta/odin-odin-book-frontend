import { NavLink } from "react-router-dom";
import { StyledNavLink } from "../../util/style";

export default function DefaultHeader() {
    return (
        <header>
            <StyledNavLink to={"/"}>Home</StyledNavLink>
            <div>
                <StyledNavLink to={"/login"}>Login</StyledNavLink>
                <StyledNavLink to={"/signup"}>Sign Up</StyledNavLink>
            </div>
        </header>
    )
};