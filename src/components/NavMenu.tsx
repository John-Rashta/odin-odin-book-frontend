import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { navMenuValue } from "../../util/style";

export default function NavMenu() {
    const [openOptions, setOpenOptions] = useState(false);
    return (
        <StyledDiv>
            <button onClick={() => {
                setOpenOptions(!openOptions);
            }}>
                <Ellipsis />
            </button>
            {
                openOptions && <StyledNav onClick={() => {
                    setOpenOptions(false);
                }}>
                    <NavLink to={"/requests"}>Requests</NavLink>
                    <NavLink to={"/followships"}>Followships</NavLink>
                    <NavLink to={"/users"}>Users</NavLink>
                    <NavLink to={"/myposts"}>MyPosts</NavLink>
                    <NavLink to={"/profile"}>Profile</NavLink>
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
`;