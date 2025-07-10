import { useState } from "react";
import { useGetIconsQuery, useGetSelfQuery, useUpdateMeMutation } from "../features/book-api/book-api-slice";
import { useNavigate } from "react-router-dom";
import { ButtonClickType, ClickType, FormType } from "../../util/types";
import { format } from "date-fns";
import FormTextFields from "./FormTextFields";
import { StyledDefaultContainer, StyledErrorMessage, StyledFlex, StyledMain } from "../../util/style";
import styled from "styled-components";
import FileDiv from "./FileDiv";

export default function Self() {
    const { data, error, isLoading } = useGetSelfQuery();
  const [invalidSize, setInvalidSize] = useState(false);
  const [failedUpload, setFailedUpload] = useState(false);
  const [iconOptions, setIconOptions] = useState(false);
  const [fileName, setFileName] = useState("");
  const [updateMe] = useUpdateMeMutation();
  const {
    data: iconData,
    error: iconError,
    isLoading: iconLoading,
  } = useGetIconsQuery();
  const navigate = useNavigate();

  const handleSubmitImage = function handleSubmitingImage(event: FormType) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    if (!target.fileInput.files || target.fileInput.files.length === 0) {
      return;
    }

    const currentFile = target.fileInput.files[0] as File;
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
        setFileName("");
      });
  };

  const handleChangePassword = function handleClickingChangePassword(
    event: ButtonClickType,
  ) {
    navigate("/password");
  };

  const handleClickIconOption = function handleClickingIconOption(
    event: ClickType,
  ) {
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
              <StyledForm
                onSubmit={handleSubmitImage}
              >
                <StyledFormDiv>
                  <FileDiv fileName={fileName} setFileName={setFileName}/>
                  <StyledSubmit type="submit">Submit</StyledSubmit>
                  <StyledFirstError>
                    {failedUpload && <div>Failed to upload.</div>}
                    {invalidSize && <div>Size Over Limit!</div>}
                  </StyledFirstError>
                </StyledFormDiv>
              </StyledForm>
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
          <MainTextContainers>
            <StyledFakeLabels>Username:</StyledFakeLabels>
            <StyledChangeFields
              fieldname="username"
              myData={data.user}
              updater={updateMe}
            />
          </MainTextContainers>
          <MainTextContainers>
            <StyledFakeLabels>About Me:</StyledFakeLabels>
            <StyledChangeFields
              fieldname="aboutMe"
              myData={data.user}
              updater={updateMe}
              area={true}
            />
          </MainTextContainers>
           <StyledChange onClick={handleChangePassword}>
            Change Password
          </StyledChange>
          <StyledTextBottom>Joined: {format(data.user.joinedAt, "MM/dd/yyyy")}</StyledTextBottom>
          <StyledTextBottom>User ID: {data.user.id}</StyledTextBottom>
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
  align-self: start;
  width: 100%;
`;

const TopRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  flex-grow: 1;
`;

const IconContainer = styled.div`
  position: relative;
`;

const IconDiv = styled.div`
  position: absolute;
  z-index: 5;
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
  gap: 10px;

`;

const StyledSubmit = styled.button`
  background-color: rgb(202, 234, 255);
  border: solid 1px black;
  padding: 3px 10px;
  align-self: start;
  &:hover {
    background-color: rgb(156, 215, 255);
  };
`;

const StyledChange = styled.button`
  padding: 3px 10px;
  background-color: rgb(227, 242, 255);
  font-weight: bold;
  &:hover {
    background-color: rgb(199, 229, 255);
  };
`;

const StyledTextBottom = styled.div`
  font-size: 1rem;
`;

const StyledChangeFields = styled(FormTextFields)`
  
`;

const MainTextContainers = styled.div`
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const StyledFakeLabels = styled.div`
  font-size: 1.1rem;

`;

const StyledFirstError = styled.div`
  position: absolute;
  top: -40px;
  left: 5px;
  color: rgb(204, 5, 5);
`;

const StyledForm = styled.form`
  position: relative;
`;