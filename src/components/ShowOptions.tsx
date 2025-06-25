import { Ellipsis } from "lucide-react"
import { ButtonClickType, ModalStartFunction, SimpleFunctionType } from "../../util/types"
import { UserExtra, UserFollowType, UserInfo } from "../../util/interfaces"
import React, { useState } from "react";
import TextOptions from "./TextOptions";
import UserOptions from "./UserOptions";
import { isUUID } from "validator";

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
        console.log(rect)
        console.log(window.innerHeight)
        if (rect.top + 42 > window.innerHeight) {
            console.log("hello")
            setOptionsStyle({
                right: 0,
                bottom: rect.height,
            });
        } else {
            setOptionsStyle({
                top: 0, 
                right: 0,
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
                    <div className="optionsContainer" style={{position: "relative"}}>
                        <button onClick={handleClick}> <Ellipsis /> </button>
                        {showOptions &&
                            (
                                textStuff ? 
                                <TextOptions styleStuff={optionsStyle} textId={textStuff.textId} type={textStuff.type} editFunc={textStuff.editFunc} closeFunc={handleClose} /> : 
                                userStuff ? 
                                <UserOptions styleStuff={optionsStyle} user={userStuff.user}/> : 
                                <></>
                            )
                        }
                    </div>)
            }
        </>
    )
};