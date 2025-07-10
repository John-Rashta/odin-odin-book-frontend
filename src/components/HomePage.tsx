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
                authState && myId === "guest" ? <BareBonesMain>
                    Guest Page
                </BareBonesMain> : <BareBonesMain>
                    Welcome to Odin Book!
                </BareBonesMain>
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

const BareBonesMain = styled(StyledMain)`
    font-size: 1.5rem;
`;