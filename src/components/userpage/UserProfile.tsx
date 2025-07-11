import { useSelector } from "react-redux";
import { UserExtra, UserInfo } from "../../../util/interfaces";
import { selectMyId } from "../../features/manager/manager-slice";
import { formatRelative } from "date-fns";
import { locale } from "../../../util/helpers";
import FollowOptions from "../partials/options/FollowOptions";
import styled from "styled-components";
import { StyledContent } from "../../../util/style";

export default function UserProfile({ info }: { info: UserInfo & UserExtra }) {
  const myId = useSelector(selectMyId);

  return (
    <StyledContainer>
      <StyledImage
        className="profileImage"
        src={info.customIcon?.url || info.icon.source}
        alt=""
      />
      <StyledMainStuff>
        <StyledFollowsContainer>
          <FollowOptions
            followers={info.followers}
            requests={info.receivedRequests}
            myId={myId}
            id={info.id}
          />
        </StyledFollowsContainer>
        <StyledBottomContainer>
          <StyledName>{info.username}</StyledName>
          {info.aboutMe ? <StyledAbout> {info.aboutMe} </StyledAbout> : <></>}
          <div>
            Joined{" "}
            {formatRelative(new Date(info.joinedAt), new Date(), { locale })}
          </div>
          <div>{info.followerCount} Followers</div>
        </StyledBottomContainer>
      </StyledMainStuff>
    </StyledContainer>
  );
}

const StyledImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
`;

const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 10px;
`;

const StyledMainStuff = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const StyledFollowsContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  height: 50px;
`;

const StyledBottomContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  font-size: 1.1rem;
  gap: 20px;
`;

const StyledAbout = styled(StyledContent)`
  max-width: 70%;
`;

const StyledName = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
`;
