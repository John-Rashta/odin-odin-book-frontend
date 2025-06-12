import { IndexRouteObject, NonIndexRouteObject } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import HomePage from "./components/HomePage";
import Notifications from "./components/Notifications";
import Requests from "./components/Requests";
import Users from "./components/Users";
import SearchUsers from "./components/SearchUsers";
import UserPage from "./components/UserPage";
import PostPage from "./components/PostPage";
import CommentPage from "./components/CommentPage";
import YourPosts from "./components/YourPosts";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import PasswordEdit from "./components/PasswordEdit";
import Followships from "./components/Followships";
import Self from "./components/Self";

const routes: (IndexRouteObject | NonIndexRouteObject)[] = [
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "notifications",
                element: <Notifications />
            },
            {
                path: "requests",
                element: <Requests />
            },
            {
                path: "users",
                element: <Users />
            },
            {
                path: "search",
                element: <SearchUsers />
            },
            {
                path: "user",
                element: <UserPage />
            },
            {
                path: "post",
                element: <PostPage />
            },
            {
                path: "comment",
                element: <CommentPage />
            },
            {
                path: "myposts",
                element: <YourPosts />
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
                element: <Followships />
            },
            {
                path: "profile",
                element: <Self />
            }
        ]
    }
];

export default routes;