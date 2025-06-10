type requestTypes = "FOLLOW";
type notificationTypes = "USER" | "POST" | "COMMENT" | "REQUEST";

type InitialPageParam = {
  skip: number
  amount: number
};

type FormType = React.FormEvent<HTMLFormElement>;

type SimpleFunctionType = () =>  void;

export {
    requestTypes,
    notificationTypes,
    InitialPageParam,
    FormType,
    SimpleFunctionType,
};