import { useState } from "react";
import {
  FullCommentInfo,
  Likes,
  OwnCommentsCount,
  YourLike,
} from "../../../util/interfaces";
import CommentEdit from "../partials/comment/CommentEdit";
import { formatRelative } from "date-fns";
import { locale } from "../../../util/helpers";
import { useSelector } from "react-redux";
import { selectMyId } from "../../features/manager/manager-slice";
import { useChangeCommentLikeMutation } from "../../features/book-api/book-api-slice";
import LikeButton from "../partials/buttons/LikeButton";
import ShowOptions from "../partials/options/ShowOptions";
import { ClickType } from "../../../util/types";
import { useNavigate } from "react-router-dom";
import {
  StyledContent,
  StyledCounts,
  StyledEdited,
  StyledFlex,
  StyledImage,
  StyledMessageImage,
  StyledUserBlue,
} from "../../../util/style";
import styled from "styled-components";
import { MessageSquare } from "lucide-react";
import { clickClass } from "../../../util/globalValues";

export default function CommentProfile({
  comment,
}: {
  comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike;
}) {
  const [showEdit, setShowEdit] = useState(false);
  const myId = useSelector(selectMyId);
  const [changeLike] = useChangeCommentLikeMutation();
  const navigate = useNavigate();

  const handleUserClick = function handleClickUser(e: ClickType) {
    navigate(`/user?id=${comment.senderid}`);
  };

  return (
    <StyledContainer>
      <div>
        <StyledImage
          className={clickClass}
          onClick={handleUserClick}
          src={comment.sender.customIcon?.url || comment.sender.icon.source}
          alt=""
        />
      </div>
      {showEdit ? (
        <StyledEdit
          comment={comment}
          changeEdit={() => {
            setShowEdit(false);
          }}
        />
      ) : (
        <StyledMainStuff>
          <StyledMainStuff>
            <StyledTop>
              <StyledFlex>
                <StyledUserBlue
                  className={clickClass}
                  onClick={handleUserClick}
                >
                  {comment.sender.username}
                </StyledUserBlue>
                <StyledEditedDiv>
                  {formatRelative(new Date(comment.sentAt), new Date(), {
                    locale,
                  })}
                </StyledEditedDiv>
              </StyledFlex>
              <StyledFlex>
                <StyledEditedDiv>
                  {comment.edited ? "Edited" : ""}
                </StyledEditedDiv>
                <ShowOptions
                  myId={myId}
                  id={comment.senderid}
                  textStuff={{
                    textId: comment.id,
                    type: "COMMENT",
                    editFunc: () => setShowEdit(true),
                  }}
                />
              </StyledFlex>
            </StyledTop>
            <div>
              <StyledContent>{comment.content}</StyledContent>
              {comment.image ? (
                <StyledMessageImage src={comment.image.url} alt="" />
              ) : (
                <></>
              )}
            </div>
            <StyledBottom>
              <StyledBottomLeft>
                {comment.ownCommentsCount > 0 ? (
                  <>
                    <StyledCounts>{comment.ownCommentsCount}</StyledCounts>
                    <MessageSquare />
                  </>
                ) : (
                  " "
                )}
              </StyledBottomLeft>
              <StyledFlex>
                <StyledLikes>
                  {comment.likesCount > 0 ? comment.likesCount : ""}
                </StyledLikes>
                <LikeButton
                  myId={myId}
                  likesInfo={comment.likes}
                  clickFunction={(e) => {
                    ///e.currentTarget.disabled = true;
                    changeLike({
                      id: comment.id,
                      action:
                        comment.likes && comment.likes.length > 0
                          ? "REMOVE"
                          : "ADD",
                    })
                      .unwrap()
                      .finally(() => {
                        ///e.currentTarget.disabled = false;
                      });
                  }}
                />
              </StyledFlex>
            </StyledBottom>
          </StyledMainStuff>
        </StyledMainStuff>
      )}
    </StyledContainer>
  );
}

const StyledEditedDiv = styled(StyledEdited)`
  align-self: center;
`;

const StyledTop = styled(StyledFlex)`
  gap: 0px;
  justify-content: space-between;
  align-items: center;
`;

const StyledMainStuff = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
`;

const StyledContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 700px;
  padding: 5px;
  font-size: 1.1rem;
  background-color: rgb(255, 255, 255);
  border: 1px solid black;
`;

const StyledEdit = styled(CommentEdit)`
  flex-grow: 1;
`;

const StyledBottomLeft = styled(StyledFlex)`
  width: 37px;
`;

const StyledLikes = styled(StyledCounts)`
  width: 8px;
`;

const StyledBottom = styled(StyledFlex)`
  gap: 10px;
`;
