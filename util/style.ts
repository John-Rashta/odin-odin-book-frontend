import { NavLink } from "react-router-dom";
import styled from "styled-components";

const mainBackgroundColor = `rgb(255, 255, 255)`;
const navMenuValue = `800px`;
const headerPadding = `20px 10px`;
const headerBackgroundColor = `rgb(202, 240, 160)`;

const StyledNavLink = styled(NavLink)`
  border: solid transparent 2px;
  border-radius: 3px;
  text-decoration: none;
  &:hover {
    border-color: rgb(218, 144, 144);
  }
  padding: 8px;
  &.active {
    background-color: rgb(169, 204, 112);
  }
`;


export {
    mainBackgroundColor,
    navMenuValue,
    StyledNavLink,
    headerBackgroundColor,
    headerPadding,
};