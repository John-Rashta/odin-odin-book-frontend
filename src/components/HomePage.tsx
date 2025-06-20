import { useSelector } from "react-redux"
import { selectMyId } from "../features/manager/manager-slice"
import { selectAuthState } from "../features/auth/auth-slice";
import { isUUID } from "validator";
import Feed from "./Feed";
import styled from "styled-components";

export default function HomePage() {
    const myId = useSelector(selectMyId);
    const authState = useSelector(selectAuthState);
    return (
        <>
            {
                authState && isUUID(myId) ? <Feed /> :
                authState && myId === "guest" ? <StyledMain>
                    guest page
                </StyledMain> : <StyledMain>
                    Welcome to Odin Book!
                </StyledMain>
            }
        </>
    )
};

const StyledMain = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;