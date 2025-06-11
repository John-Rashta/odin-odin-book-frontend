import { formatRelative } from "date-fns";
import { NotificationsInfo } from "../../util/interfaces";
import { locale } from "../../util/helpers";
import { useClearNotificationMutation } from "../features/book-api/book-api-slice";

///TODO LINKS
export default function MiniNotifications({notification} : { notification: NotificationsInfo}) {
    const [ clearNotification ] = useClearNotificationMutation();
    return (
        <div>
            <div>
                {notification.content}
            </div>
            <div>
                {formatRelative(new Date(notification.createdAt), new Date(), { locale })}
            </div>
            <button onClick={() => {
                clearNotification({id: notification.id});
            }}>
                X
            </button>
        </div>
    )
};