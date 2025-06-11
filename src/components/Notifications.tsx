import { useClearNotificationsMutation, useGetNotificationsQuery } from "../features/book-api/book-api-slice"
import MiniNotifications from "./MiniNotifications";

export default function Notifications() {
    const { notificationsData, isLoading, error} = useGetNotificationsQuery(undefined, {
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
                    {
                        notificationsData.map((ele) => {
                            return <MiniNotifications key={ele.id} notification={ele} />
                        })
                    }
                    <div>
                        <button onClick={() => {
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