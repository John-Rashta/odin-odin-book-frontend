import { useState } from "react";
import { useGetNotificationsQuery, useLogoutUserMutation, useSearchUsersInfiniteQuery } from "../features/book-api/book-api-slice"
import { skipToken } from "@reduxjs/toolkit/query";
import { NavLink, useNavigate } from "react-router-dom";
import MiniUser from "./MiniUser";
import { setUserId } from "../features/manager/manager-slice";
import { useDispatch } from "react-redux";
import { ClickType } from "../../util/types";
import MiniNotifications from "./MiniNotifications";
import ClickWrapper from "./ClickWrapper";
import NavMenu from "./NavMenu";

export default function Header() {
    const [logoutUser] = useLogoutUserMutation();
    const [searchValue, setSearchValue] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const { searchData } = useSearchUsersInfiniteQuery(searchValue !== "" ? searchValue : skipToken, {
        selectFromResult: (result) => ({
            ...result,
             searchData: result.data?.pages.map(({users}) => users).flat()
        })
    });
     const { notificationsData } = useGetNotificationsQuery(undefined, {
        selectFromResult: (result) => ({
            ...result,
            notificationsData: result.data?.notifications
        })
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    dispatch(setUserId(possibleUser));
    setSearchValue("");
    navigate("/user");
  };

    return (
        <header>
            <nav>
                <NavLink to={"/"}>Home</NavLink>
                <div style={{position: "relative"}}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        navigate("/search", {state: searchValue});
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
                            <div onClick={handleClick}>
                                {
                                    searchData.length > 0 ? searchData.map((ele) => {
                                        return <MiniUser user={ele} />
                                    }) : <div>
                                        No Result Found
                                    </div>
                                }
                            </div>
                        )
                    }
                </div>
                <div>
                    <button onClick={() => {
                        setShowNotifications(!showNotifications);
                    }}>Notifications</button>
                    {
                        (showNotifications && notificationsData && notificationsData.length > 0) && <div>
                            <ClickWrapper>
                                {
                                    notificationsData.slice(0, 25).map((ele) => {
                                    return <MiniNotifications notification={ele} />
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
                <div className="extraOptions">
                    <NavLink to={"/requests"}>Requests</NavLink>
                    <NavLink to={"/followships"}>Followships</NavLink>
                    <NavLink to={"/users"}>Users</NavLink>
                    <NavLink to={"/myposts"}>MyPosts</NavLink>
                    <NavLink to={"/profile"}>Profile</NavLink>
                </div>
                <NavMenu />
                <div onClick={() => {
                    logoutUser().unwrap().then(() => {
                        location.reload();
                    })
                }}>
                    Logout
                </div>
            </nav>
        </header>
    )
};