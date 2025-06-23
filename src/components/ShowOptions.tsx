import { Ellipsis } from "lucide-react"
import { SimpleButtonClickFunction } from "../../util/types"

export default function ShowOptions({myId, id, clickFunction} : {myId: string, id:string, clickFunction: SimpleButtonClickFunction }) {
    return (
        <>
            {
                myId !== id && <button onClick={clickFunction}> <Ellipsis /> </button>
            }
        </>
    )
};