import { useSelector } from "react-redux";
import { useClearNotificationsMutation, useGetNotificationsQuery } from "../features/book-api/book-api-slice"
import { selectMyId } from "../features/manager/manager-slice";
import ClickWrapper from "./ClickWrapper";
import MiniNotifications from "./MiniNotifications";
import { StyledDefaultContainer, StyledErrorMessage, StyledMain, StyledMainContainer, StylesReturn } from "../../util/style";
import styled from "styled-components";
import { clickClass } from "../../util/globalValues";

export default function Notifications() {
    const myId = useSelector(selectMyId);
    const { notificationsData, isLoading, error} = useGetNotificationsQuery({id: myId}, {
        selectFromResult: (result) => ({
            ...result,
            notificationsData: result.data?.notifications
        })
    });

    const [ clearNotifications ] = useClearNotificationsMutation();
    return (
        <StyledMain>
            <StyledDefaultContainer>
            {
                isLoading ? <StyledErrorMessage>
                    Loading Notifications...
                </StyledErrorMessage> : error ? <StyledErrorMessage>
                    Failed Loading Notifications!
                </StyledErrorMessage> : (notificationsData && notificationsData.length > 0) ? <StyledNotificationsContainer>
                    <div>
                        <StyledClearButton className={clickClass} onClick={(e) => {
                            clearNotifications();
                        }}>Clear Notifications</StyledClearButton>
                    </div>
                    <ClickWrapper>
                        {
                            notificationsData.map((ele) => {
                                return <StyledNotifications key={ele.id} notification={ele} />
                            })
                        }
                    </ClickWrapper>
                </StyledNotificationsContainer> : <StyledErrorMessage>
                    No Notifications Yet!
                </StyledErrorMessage>
            }
            </StyledDefaultContainer>
        </StyledMain>
    )
};

const StyledNotificationsContainer = styled(StyledMainContainer)`
    gap: 40px;
`;

const StyledClearButton = styled.button`
    font-size: 1rem;
    padding: 5px 10px;
    background-color: rgb(143, 222, 241);
    border: 1px solid black;
    &:hover {
        background-color: rgb(1, 204, 255);
    }
`;

const StyledNotifications = styled(MiniNotifications)`
    ${StylesReturn}
    align-items: center;
    div > button {
        padding: 5px 10px;
        background-color: rgb(255, 148, 148);
        font-weight: bold;
    };

    &:hover {
        background-color: rgb(147, 216, 233);
    };
`;