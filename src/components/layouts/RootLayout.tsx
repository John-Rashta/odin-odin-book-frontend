import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState, setAuthState } from "../../features/auth/auth-slice";
import { selectMyId, setMyId } from "../../features/manager/manager-slice";
import { Outlet, useLocation } from "react-router-dom";
import { useGetSelfQuery } from "../../features/book-api/book-api-slice";
import Header from "../partials/header/Header";
import DefaultHeader from "../partials/header/DefaultHeader";
import Footer from "../partials/footer/Footer";
import HomePage from "../homepage/HomePage";
import { defaultPaths, guestPaths } from "../../../util/globalValues";
import { socket } from "../../../sockets/socket";
import styled, { createGlobalStyle } from "styled-components";
import { mainBackgroundColor } from "../../../util/style";
import { isUUID } from "validator";
import GuestHeader from "../partials/header/GuestHeader";

const GlobalStyle = createGlobalStyle`
    *,
    *::before,
    *::after {
    box-sizing: border-box;
    }

    * {
        margin: 0px;
    }

    #root {
        font-family: Times, "Times New Roman", Georgia, serif;
    }

    html,
    #root,
    body {
      height: 100%;
    };


    main,
    #root,
    body,
    html {
        background-color: ${mainBackgroundColor};
    }

    img:not(.textImage, .profileImage, .messageImage) {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
`;
export default function RootLayout() {
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const myId = useSelector(selectMyId);
  const { pathname } = useLocation();
  const { data } = useGetSelfQuery();

  useEffect(() => {
    const checkSession = function checkIfActiveSession() {
      if (data) {
        if (data.user.id === myId || myId === "guest") {
          return;
        }
        socket.connect();
        dispatch(setMyId(data.user.id));
        dispatch(setAuthState(true));
      }
    };

    checkSession();
  }, [data]);

  return (
    <StyledDiv>
      <GlobalStyle />
      {authState && isUUID(myId) ? (
        <Header />
      ) : authState && myId === "guest" ? (
        <GuestHeader />
      ) : (
        <DefaultHeader />
      )}
      {!authState && !defaultPaths.includes(pathname) ? (
        <HomePage />
      ) : authState && myId === "guest" && !guestPaths.includes(pathname) ? (
        <HomePage />
      ) : authState && isUUID(myId) && defaultPaths.includes(pathname) ? (
        <HomePage />
      ) : (
        <Outlet />
      )}
      <Footer />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  min-height: 100%;
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
`;
