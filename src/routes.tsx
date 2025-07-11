import { IndexRouteObject, NonIndexRouteObject } from "react-router-dom";
import RootLayout from "./components/layouts/RootLayout";
import HomePage from "./components/homepage/HomePage";
import Notifications from "./components/notifications/Notifications";
import Requests from "./components/requests/Requests";
import Users from "./components/users/Users";
import SearchUsers from "./components/users/SearchUsers";
import UserPage from "./components/userpage/UserPage";
import PostPage from "./components/postpage/PostPage";
import CommentPage from "./components/commmentpage/CommentPage";
import YourPosts from "./components/yourpages/YourPosts";
import SignUp from "./components/defaults/SignUp";
import Login from "./components/defaults/Login";
import PasswordEdit from "./components/partials/PasswordEdit";
import Followships from "./components/followships/Followships";
import Self from "./components/yourpages/Self";

const routes: (IndexRouteObject | NonIndexRouteObject)[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "requests",
        element: <Requests />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "search",
        element: <SearchUsers />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "post",
        element: <PostPage />,
      },
      {
        path: "comment",
        element: <CommentPage />,
      },
      {
        path: "myposts",
        element: <YourPosts />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "password",
        element: <PasswordEdit />,
      },
      {
        path: "followships",
        element: <Followships />,
      },
      {
        path: "profile",
        element: <Self />,
      },
    ],
  },
];

export default routes;
