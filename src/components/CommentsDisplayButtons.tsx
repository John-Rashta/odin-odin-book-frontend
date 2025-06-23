import { SimpleBooleanFunction } from "../../util/types";

export default function CommentsDisplayButtons({count, showing, setShow} : {count: number, showing: Boolean, setShow: SimpleBooleanFunction}) {
    return (
        <>
        {
            count > 0 && (showing ? <button onClick={(e) =>  {
                e.stopPropagation();
                setShow(false);
                }}>
                Hide Comments
            </button> : <button onClick={(e) =>  {
                e.stopPropagation();
                setShow(true);
                }}>
                Show Comments
            </button>)
            }
        </>
    )
};