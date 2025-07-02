import {
  TypedLazyQueryTrigger,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  TypedMutationTrigger,
} from "@reduxjs/toolkit/query/react";

type requestTypes = "FOLLOW";
type notificationTypes = "USER" | "POST" | "COMMENT" | "REQUEST";

type InitialPageParam = {
  skip: number
  amount: number
};

type FormType = React.FormEvent<HTMLFormElement>;

type SimpleFunctionType = () =>  void;
type SvgClick = React.MouseEvent<SVGSVGElement, MouseEvent>;
type ButtonClickType = React.MouseEvent<HTMLButtonElement, MouseEvent>;
type ClickType = React.MouseEvent<HTMLDivElement, MouseEvent>;
type MutationTriggerType<T, U> = TypedMutationTrigger<
  U, ///response
  T, ///parameters
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
>;

type SimpleClickFunction = (e: ClickType) =>  void;
type SvgClickFunction  = (e: SvgClick) => void;
type SimpleButtonClickFunction = (e: ButtonClickType) => void;

type SimpleBooleanFunction = (val: boolean) => void;

type ModalStartFunction = (id: string) =>  void;

type optionalIdArray = {
  id: string
}[] | undefined;

export {
    requestTypes,
    notificationTypes,
    InitialPageParam,
    FormType,
    SimpleFunctionType,
    ButtonClickType,
    ClickType,
    MutationTriggerType,
    ModalStartFunction,
    SimpleBooleanFunction,
    SimpleButtonClickFunction,
    optionalIdArray,
    SimpleClickFunction,
    SvgClickFunction,
};