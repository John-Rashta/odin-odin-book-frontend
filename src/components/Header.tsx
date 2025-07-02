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
                            <StyledInput 
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
                                            No Results Found
                                        </StyledNoResults>
                                    }
                                </StyledSearchResult>
                            )
                        }
                    </div>
                }
                <StyledNotificationsMain>
                    <StyledNotificationsButton onClick={() => {
                        setShowNotifications(!showNotifications);
                    }}>Notifications {notificationsData ? `${notificationsData.length}` : ""}</StyledNotificationsButton>
                    {
                        ((showNotifications && notificationsData && notificationsData.length > 0) && <StyledNotificationsContainer>
                            <StyledWrapper>
                                {
                                    notificationsData.slice(0, 25).map((ele) => {
                                    return <StyledNotification key={ele.id} notification={ele} />
                                    })
                                }
                            </StyledWrapper>
                            <StyledViewButton onClick={() => {
                                navigate("/notifications");
                                setShowNotifications(false);
                            }}>
                                View All
                            </StyledViewButton>
                        </StyledNotificationsContainer>) || (showNotifications && <StyledNotificationsContainer>
                            <StyledEmptyNotificationsText>
                                No Notifications
                            </StyledEmptyNotificationsText>
                            <StyledViewButton onClick={() => {
                                navigate("/notifications");
                                setShowNotifications(false);
                            }}>
                                View All
                            </StyledViewButton>
                        </StyledNotificationsContainer>)
                    }
                </StyledNotificationsMain>
                <StyledExtraGroup className="extraOptions">
                    <StyledNavLink to={"/requests"}>Requests</StyledNavLink>
                    <StyledNavLink to={"/followships"}>Followships</StyledNavLink>
                    <StyledNavLink to={"/users"}>Users</StyledNavLink>
                    <StyledNavLink to={"/myposts"}>MyPosts</StyledNavLink>
                    <StyledNavLink to={"/profile"}>Profile</StyledNavLink>
                </StyledExtraGroup>
                <NavMenu />
                <StyledLogout onClick={() => {
                    logoutUser().unwrap().then(() => {
                        socket.disconnect();
                        location.reload();
                    }).catch()
                }}>
                    Logout
                </StyledLogout>
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

const StyledInput = styled.input`
  padding: 7px;
  background-color: rgb(255, 255, 255);
  border: 1px solid black;
  font-size: 1rem;
`;

const StyledNotificationsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    border: 1px solid black;
    font-size: 1rem;
    position: absolute;
    right: 0;
    z-index: 15;
    padding: 8px;
    max-width: 250px;
    width: 210px;
    max-height: 400px;
    background-color: rgb(183, 223, 255);
`;

const StyledNotificationsMain = styled.div`
    position: relative;
`;

const StyledNotificationsButton = styled.button`
    padding: 5px;
    font-size: 1.2rem;
    font-family: Times, "Times New Roman";
    background-color: rgb(190, 218, 255);
    &:hover {
        opacity: 0.8;
    };
`;

const StyledNotification = styled(MiniNotifications)`
    display: flex;
    align-items: center;
    gap: 5px;
    div > div {
        font-size: 0.9rem;
    };
    border-bottom: 1px solid black;
    padding: 5px;
    &:hover {
        background-color: rgb(196, 233, 255);
    };
    div > button {
        background-color: rgb(255, 197, 197);
    };
`;

const StyledWrapper = styled(ClickWrapper)`
    overflow: auto;
    max-height: 300px;
`;

const StyledViewButton = styled.button`
    padding: 5px 10px;
    background-color: rgb(196, 241, 255);
    border: 1px solid black;
    &:hover {
        opacity: 0.8;
    };
`;

const StyledEmptyNotificationsText = styled.div`
    font-size: 1.1rem;
`;

const StyledLogout = styled.div`
    cursor: pointer;
`;
