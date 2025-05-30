type requestTypes = "FOLLOW";
type notificationTypes = "USER" | "POST" | "COMMENT" | "REQUEST";

type InitialPageParam = {
  skip: number
  amount: number
}

export {
    requestTypes,
    notificationTypes,
    InitialPageParam,
};