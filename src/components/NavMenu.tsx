import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function NavMenu() {
    const [openOptions, setOpenOptions] = useState(false);
    return (
        <div>
            <button onClick={() => {
                setOpenOptions(!openOptions);
            }}>
                <Ellipsis />
            </button>
            {
                openOptions && <nav onClick={() => {
                    setOpenOptions(false);
                }}>
                    <NavLink to={"/requests"}>Requests</NavLink>
                    <NavLink to={"/followships"}>Followships</NavLink>
                    <NavLink to={"/users"}>Users</NavLink>
                    <NavLink to={"/myposts"}>MyPosts</NavLink>
                    <NavLink to={"/profile"}>Profile</NavLink>
                </nav>
            }
        </div>
    )
};