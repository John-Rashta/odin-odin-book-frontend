import { useRef, useState } from "react";
import {
  useGetNotificationsQuery,
  useLogoutUserMutation,
} from "../../../features/book-api/book-api-slice";
import { useNavigate } from "react-router-dom";
import MiniNotifications from "../MiniNotifications";
import ClickWrapper from "../wrappers/ClickWrapper";
import NavMenu from "./NavMenu";
import { socket } from "../../../../sockets/socket";
import { useSelector } from "react-redux";
import { selectMyId } from "../../../features/manager/manager-slice";
import styled from "styled-components";
import {
  headerBackgroundColor,
  headerBorderBottom,
  headerPadding,
  navMenuValue,
  StyledNavLink,
} from "../../../../util/style";
import SearchBar from "./SearchBar";
import { clickClass } from "../../../../util/globalValues";
import ClickOutsideWrapper from "../wrappers/ClickOutsideWrapper";

export default function Header() {
  const [logoutUser] = useLogoutUserMutation();
  const myId = useSelector(selectMyId);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notificationsData } = useGetNotificationsQuery(
    { id: myId },
    {
      selectFromResult: (result) => ({
        ...result,
        notificationsData: result.data?.notifications,
      }),
    },
  );
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const handleClose = function handleClosingNotifications() {
    setShowNotifications(false);
  };

  return (
    <StyledHeader>
      <StyledNav>
        <StyledNavLink to={"/"}>Home</StyledNavLink>
        <SearchBar />
        <StyledNotificationsMain ref={divRef}>
          <StyledNotificationsButton
            onClick={() => {
              setShowNotifications(!showNotifications);
            }}
          >
            Notifications{" "}
            {notificationsData ? `${notificationsData.length}` : ""}
          </StyledNotificationsButton>
          {(showNotifications &&
            notificationsData &&
            notificationsData.length > 0 && (
              <StyledNotificationsContainer
                divRef={divRef}
                closeFunc={handleClose}
              >
                <StyledWrapper>
                  {notificationsData.slice(0, 25).map((ele) => {
                    return (
                      <StyledNotification key={ele.id} notification={ele} />
                    );
                  })}
                </StyledWrapper>
                <StyledViewButton
                  className={clickClass}
                  onClick={() => {
                    navigate("/notifications");
                    setShowNotifications(false);
                  }}
                >
                  View All
                </StyledViewButton>
              </StyledNotificationsContainer>
            )) ||
            (showNotifications && (
              <StyledNotificationsContainer
                divRef={divRef}
                closeFunc={handleClose}
              >
                <StyledEmptyNotificationsText>
                  No Notifications
                </StyledEmptyNotificationsText>
                <StyledViewButton
                  className={clickClass}
                  onClick={() => {
                    navigate("/notifications");
                    setShowNotifications(false);
                  }}
                >
                  View All
                </StyledViewButton>
              </StyledNotificationsContainer>
            ))}
        </StyledNotificationsMain>
        <StyledExtraGroup className="extraOptions">
          <StyledNavLink to={"/requests"}>Requests</StyledNavLink>
          <StyledNavLink to={"/followships"}>Followships</StyledNavLink>
          <StyledNavLink to={"/users"}>Users</StyledNavLink>
          <StyledNavLink to={"/myposts"}>MyPosts</StyledNavLink>
          <StyledNavLink to={"/profile"}>Profile</StyledNavLink>
        </StyledExtraGroup>
        <NavMenu />
        <StyledLogout
          onClick={() => {
            logoutUser()
              .unwrap()
              .then(() => {
                socket.disconnect();
                location.reload();
              })
              .catch();
          }}
        >
          Logout
        </StyledLogout>
      </StyledNav>
    </StyledHeader>
  );
}

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

const StyledNotificationsContainer = styled(ClickOutsideWrapper)`
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
  }
`;

const StyledNotification = styled(MiniNotifications)`
  display: flex;
  align-items: center;
  gap: 5px;
  div > div {
    font-size: 0.9rem;
  }
  border-bottom: 1px solid black;
  padding: 5px;
  &:hover {
    background-color: rgb(196, 233, 255);
  }
  div > button {
    background-color: rgb(255, 197, 197);
  }
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
  }
`;

const StyledEmptyNotificationsText = styled.div`
  font-size: 1.1rem;
`;

const StyledLogout = styled.div`
  cursor: pointer;
`;
