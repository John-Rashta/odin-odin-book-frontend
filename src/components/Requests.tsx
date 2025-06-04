import { useGetReceivedRequestsQuery, useGetSentRequestsQuery } from "../features/book-api/book-api-slice";
import { useState } from "react";
import Request from "./Request";
import { skipToken } from "@reduxjs/toolkit/query";

export default function Requests() {
    const [selectedType, setSelectedType] = useState("RECEIVED");
    const { received, error: receivedError, isLoading: receivedLoading } = useGetReceivedRequestsQuery(undefined, {
        selectFromResult: result => ({
            ...result,
            received: result.data?.received
        })
    });
    const { sent, error: sentError , isLoading: sentLoading } = useGetSentRequestsQuery(selectedType === "SENT" ? undefined : skipToken, {
        selectFromResult:  result => ({
            ...result,
            sent: result.data?.sent
        })
    });

    return (
        <main>
            <div>
                <button onClick={() =>  setSelectedType("RECEIVED")}>Received</button>
                <button onClick={() =>  setSelectedType("SENT")}>Sent</button>
            </div>
            <div>
                {
                    (selectedType === "SENT" && (
                        sentLoading ? <div>
                            Loading Sent Requests...
                        </div> : sentError ? <div>
                            Failed Loading Sent Requests!
                        </div> : (sent && sent.length > 0) ? <div>
                            {sent.map((ele) => {
                                return <Request key={ele.id} info={ele} />
                            })}
                        </div> : <div>
                            No Sent Requests Yet!
                        </div>
                    ) || (
                        receivedLoading ? <div>
                            Loading Requests...
                        </div> : receivedError ? <div>
                            Failed Loading Requests!
                        </div> : (received && received.length > 0) ? <div>
                            {received.map((ele) => {
                                return <Request key={ele.id} info={ele} />
                            })}
                        </div> : <div>
                            No Requests Yet!
                        </div>
                    ))
                }
            </div>
        </main>
    )

};