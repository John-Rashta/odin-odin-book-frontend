import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState, setAuthState } from "../features/auth/auth-slice";
import { selectMyId, setMyId } from "../features/manager/manager-slice";
import { Outlet, useLocation } from "react-router-dom";
import { useGetSelfQuery } from "../features/book-api/book-api-slice";
import Header from "./Header";
import DefaultHeader from "./DefaultHeader";
import Footer from "./Footer";
import HomePage from "./HomePage";
import { defaultPaths } from "../../util/globalValues";
import { socket } from "../../sockets/socket";
import { createGlobalStyle } from "styled-components";
import { mainBackgroundColor } from "../../util/style";

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
        overflow: hidden;
    }

    #root,
    body,
    html {
        height: 100%;
    }


    main,
    #root,
    body,
    html {
        background-color: ${mainBackgroundColor};
    }

    img:not(.textImage) {
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
    <div>
      <GlobalStyle />
      {authState ? <Header /> : <DefaultHeader />}
      {!authState && !defaultPaths.includes(pathname) ? (
        <HomePage />
      ) : authState && defaultPaths.includes(pathname) ? (
        <HomePage />
      ) : (
        <Outlet />
      )}
      <Footer />
    </div>
  );
}