import { Ellipsis } from "lucide-react"
import { ButtonClickType, ModalStartFunction, SimpleFunctionType } from "../../util/types"
import { UserExtra, UserFollowType, UserInfo } from "../../util/interfaces"
import React, { useState } from "react";
import TextOptions from "./TextOptions";
import UserOptions from "./UserOptions";
import { isUUID } from "validator";
import styled from "styled-components";

interface TextInterface {
    textId: string,
    type: "POST" | "COMMENT",
    editFunc: SimpleFunctionType | ModalStartFunction,
};

interface UserInterface {
    user: UserFollowType & UserExtra | UserInfo & UserExtra
};

export default function ShowOptions({myId, id, textStuff, userStuff} : {myId: string, id:string, textStuff?: TextInterface , userStuff?: UserInterface}) {
    const [showOptions, setShowOptions] = useState(false);
    const [optionsStyle, setOptionsStyle] = useState({} as React.CSSProperties);
    
    const handleClick = function handleClickButton(e: ButtonClickType) {
        e.stopPropagation();
        setShowOptions(!showOptions);
        const parent = e.currentTarget.closest(".optionsContainer") as HTMLDivElement;
        if (!parent) {
            return;
        };
        const rect = parent.getBoundingClientRect();
        if (rect.top + 42 > window.innerHeight) {
            setOptionsStyle({
                right: 40,
                bottom: rect.height,
            });
        } else {
            setOptionsStyle({
                top: 0, 
                right: 40,
            });
        }
    };

    const handleClose = function closeOptionsOnClick() {
        setShowOptions(false);
    };

    return (
        <>
            {isUUID(myId) && 
                ((myId !== id && userStuff || myId === id && textStuff) &&
                    <StyledContainer className="optionsContainer" style={{position: "relative"}}>
                        <StyledButton onClick={handleClick}> <Ellipsis/> </StyledButton>
                        {showOptions &&
                            (
                                textStuff ? 
                                <TextOptions styleStuff={optionsStyle} textId={textStuff.textId} type={textStuff.type} editFunc={textStuff.editFunc} closeFunc={handleClose} /> : 
                                userStuff ? 
                                <UserOptions styleStuff={optionsStyle} user={userStuff.user}/> : 
                                <></>
                            )
                        }
                    </StyledContainer>)
            }
        </>
    )
};

const StyledButton = styled.button`
    height: 30px;
    border: 0 solid black;
    display: flex;
    align-items: center;
    background-color: transparent;
    &:hover {
        background-color: rgb(167, 227, 255);
    }
`;

const StyledContainer = styled.div`
    align-self: start;
`;