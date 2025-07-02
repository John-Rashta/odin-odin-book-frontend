import { useLocation, useNavigate } from "react-router-dom";
import { ButtonClickType, ModalStartFunction, SimpleFunctionType } from "../../util/types";
import { useDeleteCommentMutation, useDeletePostMutation } from "../features/book-api/book-api-slice";
import React from "react";
import styled from "styled-components";

export default function TextOptions({textId, editFunc, type, closeFunc, styleStuff} : {textId: string, editFunc: SimpleFunctionType | ModalStartFunction, type: "COMMENT" | "POST", closeFunc: SimpleFunctionType, styleStuff?: React.CSSProperties}) {
    const [ deletePost ] = useDeletePostMutation();
    const [ deleteComment ] = useDeleteCommentMutation();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleDelete = function handleDeletesInOptions(event: ButtonClickType) {
        event.stopPropagation();
        event.preventDefault();
        const currentTarget = event.currentTarget;
        currentTarget.disabled = true;

        if (type === "POST") {
            deletePost({id: textId}).unwrap().then(() => {
                if (pathname === "/post") {
                    navigate("/");
                } else {
                    closeFunc();
                };
            }).catch((result) => {
                if (result.data.message) {
                    console.log(result.data.message);
                };
                currentTarget.disabled = false;
            });
            return;
        } else if (type === "COMMENT") {
            deleteComment({id: textId}).unwrap().then(() => {
                if (pathname === "/comment") {
                    navigate("/");
                } else {
                    closeFunc();
                };
            }).catch((result) => {
                if (result.data.message) {
                    console.log(result.data.message);
                };
                currentTarget.disabled = false;
            });;
            return;
        }
    };

    const handleEdit = function handleClickingEdit (event: ButtonClickType) {
        event.stopPropagation();
        event.preventDefault();
        const currentTarget = event.currentTarget;
        currentTarget.disabled = true;

        editFunc(textId);
        closeFunc();
    };

    return (
        <StyledTextOptions style={{...styleStuff}}>
            <StyledButtons onClick={handleEdit}>
                Edit
            </StyledButtons>
            <StyledButtons onClick={handleDelete}>
                Delete
            </StyledButtons>
        </StyledTextOptions>
    )
};

const StyledTextOptions = styled.div`
    position: absolute;
    max-width: 200px;
    width: 120px;
    z-index: 3;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    gap: 1px;
    background-color: black;
`;

const StyledButtons = styled.button`
    border: none;
    flex-grow: 1;
    padding: 5px;
    background-color: rgb(196, 241, 255);
    &:hover {
        background-color: rgb(136, 207, 255);
    };
    font-weight: bold;
`;
