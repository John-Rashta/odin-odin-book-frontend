import { formatRelative } from "date-fns";
import { NotificationsInfo } from "../../util/interfaces";
import { locale } from "../../util/helpers";
import { useClearNotificationMutation } from "../features/book-api/book-api-slice";

///TODO LINKS
export default function MiniNotifications({notification} : { notification: NotificationsInfo}) {
    const [ clearNotification ] = useClearNotificationMutation();
    return (
        <div
        className={`clickOption ${ 
            notification.type === "COMMENT" ? "commentOption" :
            notification.type === "POST" ? "postOption" :
            notification.type === "USER" ? "userOption" :
            notification.type === "REQUEST" ? "requestOption" :
            ""
        }`}
        {...(
            notification.type === "COMMENT" ? {"data-commentid": notification.typeid} :
            notification.type === "POST" ? {"data-postid": notification.typeid} :
            notification.type === "USER" ? {"data-userid": notification.typeid} :
            {}
        )}
        >
            <div>
                {notification.content}
            </div>
            <div>
                {formatRelative(new Date(notification.createdAt), new Date(), { locale })}
            </div>
            <button onClick={(e) => {
                e.stopPropagation();
                clearNotification({id: notification.id});
            }}>
                X
            </button>
        </div>
    )
};