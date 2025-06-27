import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { navMenuValue } from "../../util/style";

export default function NavMenu() {
    const [openOptions, setOpenOptions] = useState(false);
    return (
        <StyledDiv
        >
            <StyledButton onClick={(e) => {
                setOpenOptions(!openOptions);
            }}>
                <Ellipsis />
            </StyledButton>
            {
                openOptions && <StyledNav
                    onClick={() => {
                        setOpenOptions(false);
                }}>
                    <StyledNavLink to={"/requests"}>Requests</StyledNavLink>
                    <StyledNavLink to={"/followships"}>Followships</StyledNavLink>
                    <StyledNavLink to={"/users"}>Users</StyledNavLink>
                    <StyledNavLink to={"/myposts"}>MyPosts</StyledNavLink>
                    <StyledNavLink to={"/profile"}>Profile</StyledNavLink>
                </StyledNav>
            }
        </StyledDiv>
    )
};

const StyledDiv = styled.div`
  @media only screen and (min-width: ${navMenuValue}) {
    display: none;
  };
  position: relative;
`;

const StyledNav = styled.nav`
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
    z-index: 15;
    background-color: rgb(154, 215, 255);
    border: 1px solid black;
    gap: 2px;
    max-width: 250px;
    width: 150px;
`;

const StyledButton = styled.button`
    background-color: rgb(255, 255, 255);
    border: 1px solid black;
    &:hover {
        background-color: rgb(174, 207, 255);
    };
`;

const StyledNavLink = styled(NavLink)`
    &:hover {
        background-color: rgb(255, 255, 255);
    };
    padding: 10px;
`;