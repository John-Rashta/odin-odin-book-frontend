import { useSelector } from "react-redux";
import { useClearNotificationsMutation, useGetNotificationsQuery } from "../features/book-api/book-api-slice"
import { selectMyId } from "../features/manager/manager-slice";
import ClickWrapper from "./ClickWrapper";
import MiniNotifications from "./MiniNotifications";

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
        <main>
            {
                isLoading ? <div>
                    Loading Notifications...
                </div> : error ? <div>
                    Failed Loading Notifications!
                </div> : (notificationsData && notificationsData.length > 0) ? <div>
                    <ClickWrapper>
                        {
                            notificationsData.map((ele) => {
                                return <MiniNotifications key={ele.id} notification={ele} />
                            })
                        }
                    </ClickWrapper>
                    <div>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            clearNotifications();
                        }}>Clear Notifications</button>
                    </div>
                </div> : <div>
                    No Notifications Yet!
                </div>
            }
        </main>
    )
};