import styled from "styled-components";
import { SimpleBooleanFunction } from "../../util/types";

export default function CommentsDisplayButtons({count, showing, setShow} : {count: number, showing: Boolean, setShow: SimpleBooleanFunction}) {
    return (
        <>
        {
            count > 0 && (showing ? <StyledButtons className="displayOption" onClick={(e) =>  {
                e.stopPropagation();
                setShow(false);
                }}>
                Hide Comments
            </StyledButtons> : <StyledButtons className="displayOption" onClick={(e) =>  {
                e.stopPropagation();
                setShow(true);
                }}>
                Show Comments
            </StyledButtons>)
            }
        </>
    )
};

const StyledButtons = styled.button`
    font-weight: bold;
    background-color: rgb(238, 247, 255);
    border: 1px solid black;
    border-radius: 5px;
    &:hover {
        background-color: rgb(191, 225, 255);
    };

`;