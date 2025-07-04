import { useState } from "react";
import { useGetIconsQuery, useGetSelfQuery, useUpdateMeMutation } from "../features/book-api/book-api-slice";
import { useNavigate } from "react-router-dom";
import { ButtonClickType, ClickType, FormType } from "../../util/types";
import { format } from "date-fns";
import FormTextFields from "./FormTextFields";
import { StyledDefaultContainer, StyledErrorMessage, StyledFileDiv, StyledFileLabel, StyledFlex, StyledInputFile, StyledMain } from "../../util/style";
import styled from "styled-components";

export default function Self() {
    const { data, error, isLoading } = useGetSelfQuery();
  const [invalidSize, setInvalidSize] = useState(false);
  const [failedUpload, setFailedUpload] = useState(false);
  const [iconOptions, setIconOptions] = useState(false);
  const [updateMe] = useUpdateMeMutation();
  const {
    data: iconData,
    error: iconError,
    isLoading: iconLoading,
  } = useGetIconsQuery();
  const navigate = useNavigate();

  const handleSubmitImage = function handleSubmitingImage(event: FormType) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLFormElement;
    if (target.imageInput.files.length === 0) {
      return;
    }

    const currentFile = target.imageInput.files[0] as File;
    if (Number((currentFile.size / 1024 / 1024).toFixed(4)) > 5) {
      if (!invalidSize) {
        setTimeout(() => {
          setInvalidSize(false);
        }, 5000);
      }
      setInvalidSize(true);
      return;
    }

    const newForm = new FormData();
    newForm.append("uploaded_file", currentFile);
    updateMe(newForm)
      .unwrap()
      .then()
      .catch(() => {
        if (!failedUpload) {
          setTimeout(() => {
            setFailedUpload(false);
          }, 5000);
        }
        setFailedUpload(true);
      })
      .finally(() => {
        target.reset();
      });
  };

  const handleChangePassword = function handleClickingChangePassword(
    event: ButtonClickType,
  ) {
    event.stopPropagation();
    navigate("/password");
  };

  const handleClickIconOption = function handleClickingIconOption(
    event: ClickType,
  ) {
    event.stopPropagation();
    const target = event.target as HTMLDivElement;
    if (target.dataset.type === "ICONOPTION") {
      const possibleId = target.dataset.iconid;
      if (!possibleId) {
        return;
      }
      const newForm = new FormData();
      newForm.append("icon", possibleId);
      updateMe(newForm);
      setIconOptions(false);
    }
  };
  
  return (
    <StyledMain>
      <StyledDefaultContainer>
      {isLoading ? (
        <StyledErrorMessage>Loading...</StyledErrorMessage>
      ) : error ? (
        <StyledErrorMessage>Error Loading!</StyledErrorMessage>
      ) : data && data.user ? (
        <>
          <TopContainer>
            <ProfileImage
              className="profileImage"
              src={data.user.customIcon?.url || data.user.icon.source}
              alt=""
            />
            <TopRight>
              <form
                onSubmit={handleSubmitImage}
                onClick={(e) => e.stopPropagation()}
              >
                <StyledFormDiv>
                  <StyledFileDiv>
                    <StyledLabelStuff htmlFor="imageInput">
                      Choose image for icon (max 5MB)
                    </StyledLabelStuff>
                    <StyledInputFile
                      type="file"
                      id="imageInput"
                      name="imageInput"
                      accept=".png,.webp,.jpeg,.jpg"
                    />
                  </StyledFileDiv>
                  <StyledSubmit type="submit">Submit</StyledSubmit>
                  <div>
                    {failedUpload && <div>Failed to upload.</div>}
                    {invalidSize && <div>Size Over Limit!</div>}
                  </div>
                </StyledFormDiv>
              </form>
              <IconContainer onClick={handleClickIconOption}>
                <IconButton onClick={() => setIconOptions(!iconOptions)}>
                  Icons
                </IconButton>
                {iconOptions && iconData && (
                  
                    <IconDiv>
                    {iconData.icons.map((icon) => {
                      return (
                        <IconImg
                          key={icon.id}
                          src={icon.source}
                          alt=""
                          data-iconid={icon.id}
                          data-type="ICONOPTION"
                        />
                      );
                    })}
                    </IconDiv>
                )}
              </IconContainer>
            </TopRight>
          </TopContainer>
          <div>
            <div>Username:</div>
            <FormTextFields
              fieldname="username"
              myData={data.user}
              updater={updateMe}
            />
          </div>
          <button onClick={handleChangePassword}>
            Change Password
          </button>
          <div>
            <div>About Me:</div>
            <FormTextFields
              fieldname="aboutMe"
              myData={data.user}
              updater={updateMe}
              area={true}
            />
          </div>
          <div>Joined: {format(data.user.joinedAt, "MM/dd/yyyy")}</div>
          <div>User ID: {data.user.id}</div>
        </>
      ) : (
        <StyledErrorMessage>Something went wrong...</StyledErrorMessage>
      )}
      </StyledDefaultContainer>
    </StyledMain>
  );
};

const ProfileImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 50%;
`;

const TopContainer = styled(StyledFlex)`

`;

const TopRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const IconContainer = styled.div`
  position: relative;
`;

const IconDiv = styled.div`
  position: absolute;
  z-index: 5;
  right: 0;
  width: 170px;
  padding: 5px;
  border: solid 1px black;
  background-color: rgb(212, 220, 255);
`;

const IconImg = styled.img`
 &:hover {
  opacity: 0.8;
 }
`;

const IconButton = styled.button`
  padding: 5px 10px;
  background-color: rgb(223, 240, 255);
  border-radius: 10px;
  &:hover {
    background-color: rgb(162, 187, 255);
  };
`;

const StyledFormDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

`;

const StyledSubmit = styled.button`
  background-color: rgb(202, 234, 255);
  border: solid 1px black;
  padding: 3px 10px;
  &:hover {
    background-color: rgb(156, 215, 255);
  };
`;

const StyledLabelStuff = styled(StyledFileLabel)`
  background-color: rgb(187, 250, 255);
  padding: 5px;
  border-radius: 5px;
  border: 1px solid black;
  font-weight: bold;
  &:hover {
    background-color: rgb(122, 246, 255);
  };
`;