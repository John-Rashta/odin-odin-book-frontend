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

        dispatch(setMyId(data.user.id));
        dispatch(setAuthState(true));
      }
    };

    checkSession();
  }, [data]);

  return (
    <div>
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