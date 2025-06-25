import { useState } from "react";
import { useGetNotificationsQuery, useLogoutUserMutation, useSearchUsersInfiniteQuery } from "../features/book-api/book-api-slice"
import { skipToken } from "@reduxjs/toolkit/query";
import { useLocation, useNavigate } from "react-router-dom";
import MiniUser from "./MiniUser";
import { ClickType } from "../../util/types";
import MiniNotifications from "./MiniNotifications";
import ClickWrapper from "./ClickWrapper";
import NavMenu from "./NavMenu";
import { socket } from "../../sockets/socket";
import { useSelector } from "react-redux";
import { selectMyId } from "../features/manager/manager-slice";
import styled from "styled-components";
import { headerBackgroundColor, headerBorderBottom, headerPadding, navMenuValue, StyledNavLink } from "../../util/style";

export default function Header() {
    const [logoutUser] = useLogoutUserMutation();
    const myId = useSelector(selectMyId);
    const { pathname } = useLocation();
    const [searchValue, setSearchValue] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const { searchData } = useSearchUsersInfiniteQuery(searchValue !== "" ? searchValue : skipToken, {
        selectFromResult: (result) => ({
            ...result,
             searchData: result.data?.pages.map(({users}) => users).flat()
        })
    });
     const { notificationsData } = useGetNotificationsQuery({id: myId}, {
        selectFromResult: (result) => ({
            ...result,
            notificationsData: result.data?.notifications
        })
    });
    const navigate = useNavigate();

    const handleClick = function handleClickingSearchResult(event: ClickType) {
    const target = event.target as HTMLElement;
    const realTarget = target.closest(".searchResult");
    if (!realTarget || !(realTarget instanceof HTMLElement)) {
      return;
    }
    const possibleUser = realTarget.dataset.userid;
    if (!possibleUser) {
      return;
    }

    setSearchValue("");
    navigate(`/user?id=${possibleUser}`);
  };

    return (
        <StyledHeader>
            <StyledNav>
                <StyledNavLink to={"/"}>Home</StyledNavLink>
                { pathname !== "/search"  &&
                    <div style={{position: "relative"}}>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            setSearchValue("");
                            navigate(`/search?user=${searchValue}`);
                            return;
                        }}>
                            <input 
                                type="text"
                                name="searchBar"
                                id="searchBar"
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                }}
                            />
                        </form>
                        {
                            (searchData && searchValue !== "") && (
                                <StyledSearchResult onClick={handleClick}>
                                    {
                                        (searchData.length > 0) ? searchData.map((ele) => {
                                            return <MiniUser key={ele.id} user={ele} />
                                        }) : <StyledNoResults>
                                            No Result Found
                                        </StyledNoResults>
                                    }
                                </StyledSearchResult>
                            )
                        }
                    </div>
                }
                <div>
                    <button onClick={() => {
                        setShowNotifications(!showNotifications);
                    }}>Notifications {notificationsData ? `${notificationsData.length}` : ""}</button>
                    {
                        (showNotifications && notificationsData && notificationsData.length > 0) && <div>
                            <ClickWrapper>
                                {
                                    notificationsData.slice(0, 25).map((ele) => {
                                    return <MiniNotifications key={ele.id} notification={ele} />
                                    })
                                }
                            </ClickWrapper>
                            <button onClick={() => {
                                navigate("/notifications");
                                setShowNotifications(false);
                            }}>
                                View All
                            </button>
                        </div>
                    }
                </div>
                <StyledExtraGroup className="extraOptions">
                    <StyledNavLink to={"/requests"}>Requests</StyledNavLink>
                    <StyledNavLink to={"/followships"}>Followships</StyledNavLink>
                    <StyledNavLink to={"/users"}>Users</StyledNavLink>
                    <StyledNavLink to={"/myposts"}>MyPosts</StyledNavLink>
                    <StyledNavLink to={"/profile"}>Profile</StyledNavLink>
                </StyledExtraGroup>
                <NavMenu />
                <div onClick={() => {
                    logoutUser().unwrap().then(() => {
                        socket.disconnect();
                        location.reload();
                    }).catch()
                }}>
                    Logout
                </div>
            </StyledNav>
        </StyledHeader>
    )
};

const StyledExtraGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  @media only screen and (max-width: ${navMenuValue}) {
    display: none;
  }
`;

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


const StyledSearchResult = styled.div`
  border: 1px solid black;
  position: absolute;
  background-color: rgb(255, 255, 255);
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow: auto;
`;

const StyledNoResults = styled.div`
  padding: 10px;
`;
