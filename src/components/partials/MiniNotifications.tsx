import { formatRelative } from "date-fns";
import { NotificationsInfo } from "../../../util/interfaces";
import { locale } from "../../../util/helpers";
import { useClearNotificationMutation } from "../../features/book-api/book-api-slice";
import styled from "styled-components";
import { clickClass } from "../../../util/globalValues";

///TODO LINKS
export default function MiniNotifications({
  notification,
  className,
}: {
  notification: NotificationsInfo;
  className?: string;
}) {
  const [clearNotification] = useClearNotificationMutation();
  return (
    <div
      className={`clickOption ${className || ""} ${
        notification.type === "COMMENT"
          ? "commentOption"
          : notification.type === "POST"
            ? "postOption"
            : notification.type === "USER"
              ? "userOption"
              : notification.type === "REQUEST"
                ? "requestOption"
                : ""
      }`}
      {...(notification.type === "COMMENT"
        ? { "data-commentid": notification.typeid }
        : notification.type === "POST"
          ? { "data-postid": notification.typeid }
          : notification.type === "USER"
            ? { "data-userid": notification.typeid }
            : {})}
    >
      <div>{notification.content}</div>
      <StyledDateButton>
        <div>
          {formatRelative(new Date(notification.createdAt), new Date(), {
            locale,
          })}
        </div>
        <StyledButton
          className={clickClass}
          onClick={(e) => {
            clearNotification({ id: notification.id });
          }}
        >
          X
        </StyledButton>
      </StyledDateButton>
    </div>
  );
}

const StyledDateButton = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledButton = styled.button`
  &:hover {
    background-color: rgb(204, 41, 41);
    color: white;
  }
`;
