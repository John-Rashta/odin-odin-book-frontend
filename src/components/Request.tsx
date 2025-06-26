import { useSelector } from "react-redux";
import { useAcceptRequestMutation, useDeleteRequestMutation } from "../features/book-api/book-api-slice"
import { selectMyId } from "../features/manager/manager-slice";
import { ReceivedExtra, RequestInfo, SentExtra } from "../../util/interfaces";
import { StyledDivFlex, StyledErrorMessage, StyledReturn } from "../../util/style";
import styled from "styled-components";

type ReceivedType = (RequestInfo & ReceivedExtra);
type SentType =( RequestInfo & SentExtra);
type InfoType = ReceivedType | SentType;

export default function Request({info} : {info: InfoType}) {
    const myId  = useSelector(selectMyId);
    const [acceptRequest] = useAcceptRequestMutation();
    const [deleteRequest] = useDeleteRequestMutation();

    return (
        <StyledExtraRequest>
            {
                (info.senderid === myId && ("target" in info)) ? <>
                    <StyledText data-id={info.id}>
                         {`You sent a Follow Request to ${info.target.username}`}
                    </StyledText>
                    <StyledButtonContainer>
                        <StyledRequestButton onClick={(e) => {
                            e.stopPropagation();
                            deleteRequest({id: info.id, type: "CANCEL", userid: info.target.id});
                            }}>Cancel</StyledRequestButton>
                    </StyledButtonContainer>
                    
                </> : ("sender" in info) ? <>
                    <StyledText data-id={info.id}>
                         {`${info.sender.username} sent you a Follow Request`}
                    </StyledText>
                    <StyledButtonContainer>
                        <StyledAccept onClick={(e) => {
                            e.stopPropagation();
                            acceptRequest({id: info.id});
                            }}>Accept</StyledAccept>
                        <StyledRequestButton onClick={(e) => {
                            e.stopPropagation();
                            deleteRequest({id: info.id, type: "REJECT", userid: info.sender.id})
                            }}>Reject</StyledRequestButton>
                    </StyledButtonContainer>
                </> : <StyledErrorMessage>
                    Error Request!
                </StyledErrorMessage>
            }
        </StyledExtraRequest>
    )
};

const StyledExtraRequest = styled(StyledReturn)`
    &:hover {
    background-color: rgb(206, 248, 255);
    };
    align-items: center;
`;

const StyledRequestButton = styled.button`
  padding: 8px;
  font-weight: bold;
  background-color: rgba(216, 0, 0, 0.88);
  color: rgb(255, 255, 255);
  &:hover {
    background-color: rgba(29, 132, 216, 0.88);
  }
`;

const StyledAccept = styled(StyledRequestButton)`
  background-color: rgb(11, 138, 0);
`;

const StyledButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StyledText = styled(StyledDivFlex)`
  gap: 5px;
  font-size: 1.1rem;
`;
