import { useSelector } from "react-redux"
import { selectMyId } from "../features/manager/manager-slice"
import { selectAuthState } from "../features/auth/auth-slice";
import { isUUID } from "validator";
import Feed from "./Feed";

export default function HomePage() {
    const myId = useSelector(selectMyId);
    const authState = useSelector(selectAuthState);
    return (
        <>
            {
                authState && isUUID(myId) ? <Feed /> :
                authState && myId === "guest" ? <main>
                    guest page
                </main> : <main>
                    Welcome to Odin Book!
                </main>
            }
        </>
    )
};