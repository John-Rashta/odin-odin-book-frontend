import { useGetReceivedRequestsQuery, useGetSentRequestsQuery } from "../features/book-api/book-api-slice";
import { useState } from "react";
import Request from "./Request";
import { skipToken } from "@reduxjs/toolkit/query";
import styled from "styled-components";
import { StyledErrorMessage, StyledMain, StyledDefaultContainer, StyledMainContainer } from "../../util/style";

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
        <StyledMain>
            <StyledDefaultContainer>
                <StyledButtonsContainer>
                    <StyledClickButton
                    $trueType="RECEIVED"
                    $currentType={selectedType}
                    onClick={() =>  setSelectedType("RECEIVED")}>Received</StyledClickButton>
                    <StyledClickButton
                    $trueType="SENT"
                    $currentType={selectedType}
                    onClick={() =>  setSelectedType("SENT")}>Sent</StyledClickButton>
                </StyledButtonsContainer>
                <StyledMainContainer>
                    {
                        (selectedType === "SENT" && (
                            sentLoading ? <StyledErrorMessage>
                                Loading Sent Requests...
                            </StyledErrorMessage> : sentError ? <StyledErrorMessage>
                                Failed Loading Sent Requests!
                            </StyledErrorMessage> : (sent && sent.length > 0) ?
                                sent.map((ele) => {
                                    return <Request key={ele.id} info={ele} />
                                })
                            : <StyledErrorMessage>
                                No Sent Requests Yet!
                            </StyledErrorMessage>
                        ) || (
                            receivedLoading ? <StyledErrorMessage>
                                Loading Requests...
                            </StyledErrorMessage> : receivedError ? <StyledErrorMessage>
                                Failed Loading Requests!
                            </StyledErrorMessage> : (received && received.length > 0) ? 
                                received.map((ele) => {
                                    return <Request key={ele.id} info={ele} />
                                })
                            : <StyledErrorMessage>
                                No Requests Yet!
                            </StyledErrorMessage>
                        ))
                    }
                </StyledMainContainer>
            </StyledDefaultContainer>
        </StyledMain>
    )

};

const StyledButtonsContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const StyledClickButton = styled.button<{
  $currentType?: string;
  $trueType?: string;
}>`
  background-color: ${(props) =>
    (props.$currentType === props.$trueType && "rgb(51, 163, 255)") ||
    "rgb(219, 245, 252)"};
  padding: 10px 20px;
  font-weight: bold;
  font-size: 1rem;
`;