import { useEffect, useRef, useState } from "react"
import styled from "styled-components";

export default function ExpandableTextarea({names, className, textValue, setTextValue} : {names: string, textValue: string, setTextValue: React.Dispatch<React.SetStateAction<string>>, className?: string}) {
    const textRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (!textRef || !textRef.current) {
            return;
        };

        textRef.current.style.height = "auto";
        textRef.current.style.height = `${textRef.current.scrollHeight+10}px`;

    }, [textRef, textValue]);


    return (
        <StyledTextarea
        className={className}
        name={names}
        id={names}
        ref={textRef}
        value={textValue}
        onChange={(e) =>  setTextValue(e.target.value)}
        ></StyledTextarea>
    )
};

const StyledTextarea = styled.textarea`
    resize: none;
    line-height: 1;
    padding: 8px;
    font-size: 1rem;
`;