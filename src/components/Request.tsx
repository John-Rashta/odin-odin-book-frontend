import { useSelector } from "react-redux";
import { useAcceptRequestMutation, useDeleteRequestMutation } from "../features/book-api/book-api-slice"
import { selectMyId } from "../features/manager/manager-slice";
import { ReceivedExtra, RequestInfo, SentExtra } from "../../util/interfaces";

type ReceivedType = (RequestInfo & ReceivedExtra);
type SentType =( RequestInfo & SentExtra);
type InfoType = ReceivedType | SentType;

export default function Request({info} : {info: InfoType}) {
    const myId  = useSelector(selectMyId);
    const [acceptRequest] = useAcceptRequestMutation();
    const [deleteRequest] = useDeleteRequestMutation();

    const generateOptions = function getRequestOptions() {

    };

    return (
        <main>
            {
                (info.senderid === myId && ("target" in info)) ? <div>
                    <div data-id={info.id}>
                         {`You sent a Follow Request to ${info.target.username}`}
                    </div>
                    <div>
                        <button onClick={() => deleteRequest({id: info.id, type: "CANCEL", userid: info.target.id})}>Cancel</button>
                    </div>
                    
                </div> : ("sender" in info) ? <div>
                    <div data-id={info.id}>
                         {`${info.sender.username} sent you a Follow Request`}
                    </div>
                    <div>
                        <button onClick={() => acceptRequest({id: info.id})}>Accept</button>
                        <button onClick={() => deleteRequest({id: info.id, type: "REJECT", userid: info.sender.id})}>Reject</button>
                    </div>
                </div> : <div>
                    Error Request!
                </div>
            }
        </main>
    )
};