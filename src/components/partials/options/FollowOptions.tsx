import { isUUID } from "validator";
import { optionalIdArray } from "../../../../util/types";
import {
  useDeleteRequestMutation,
  useMakeRequestMutation,
  useStopFollowMutation,
} from "../../../features/book-api/book-api-slice";
import styled from "styled-components";
import { clickClass } from "../../../../util/globalValues";

export default function FollowOptions({
  myId,
  id,
  followers,
  requests,
}: {
  myId: string;
  id: string;
  followers: optionalIdArray;
  requests: optionalIdArray;
}) {
  const [deleteRequest] = useDeleteRequestMutation();
  const [stopFollowing] = useStopFollowMutation();
  const [makeRequest] = useMakeRequestMutation();
  return (
    <>
      {isUUID(myId) &&
        myId !== id &&
        (followers && followers.length > 0 ? (
          <StyledFollowButtons
            className={clickClass}
            onClick={() => stopFollowing({ id: id })}
          >
            Stop Following
          </StyledFollowButtons>
        ) : requests && requests.length > 0 ? (
          <StyledRequest className={clickClass}>
            Pending Request{" "}
            <StyledRequestButton
              onClick={() => {
                if (!requests) {
                  return;
                }
                deleteRequest({
                  id: requests[0].id,
                  type: "CANCEL",
                  userid: id,
                });
              }}
            >
              X
            </StyledRequestButton>
          </StyledRequest>
        ) : (
          <StyledFollowButtons
            className={clickClass}
            onClick={(e) => {
              makeRequest({ id: id, type: "FOLLOW" });
            }}
          >
            Request Follow
          </StyledFollowButtons>
        ))}
    </>
  );
}

const StyledFollowButtons = styled.button`
  padding: 5px 10px;
  border-radius: 10px;
  border: 1px solid black;
  font-size: 0.9rem;
  background-color: rgb(255, 255, 255);
  &:hover {
    background-color: rgb(109, 209, 255);
  }
`;

const StyledRequest = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  font-size: 1.1rem;
`;

const StyledRequestButton = styled.button`
  background-color: rgb(255, 255, 255);
  padding: 5px 10px;
  border-radius: 50%;
  border: 1px solid black;
  font-weight: bold;
  &:hover {
    background-color: rgb(255, 87, 75);
  }
`;
