import styled from "styled-components";
import { headerBackgroundColor, headerBorderBottom, headerPadding, StyledNavLink } from "../../util/style";
import SearchBar from "./SearchBar";
import { socket } from "../../sockets/socket";

export default function GuestHeader() {
    return (
        <StyledHeader>
            <StyledNav>
                <StyledNavLink to={"/"}>Home</StyledNavLink>
                <SearchBar />
                <StyledNavLink to={"/users"}>Users</StyledNavLink>
                <StyledLogout onClick={() => {
                    socket.disconnect();
                    location.reload();
                }}>
                    Logout
                </StyledLogout>
            </StyledNav>
        </StyledHeader>
    )
};

const StyledHeader = styled.header`
  background-color: ${headerBackgroundColor};
  padding: ${headerPadding};
  font-size: 1.3rem;
  border-bottom: ${headerBorderBottom};
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledLogout = styled.div`
    cursor: pointer;
`;