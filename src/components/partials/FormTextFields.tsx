import { useState } from "react";
import { ReturnMessage, UserInfo } from "../../../util/interfaces";
import { FormType, MutationTriggerType } from "../../../util/types";
import ExpandableTextarea from "./ExpandableTextarea";
import { StyledContent } from "../../../util/style";
import styled from "styled-components";
import { clickClass } from "../../../util/globalValues";

type FieldNameOptions = "username" | "aboutMe";

export default function FormTextFields({
  myData,
  fieldname,
  updater,
  area,
  className,
}: {
  myData: UserInfo;
  fieldname: FieldNameOptions;
  updater: MutationTriggerType<FormData, ReturnMessage>;
  area?: boolean;
  className?: string;
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [showError, setShowError] = useState(false);
  const [textValue, setTextValue] = useState(myData[fieldname] || "");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = function handleClickingEditSubmit(event: FormType) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const updatedValue = target[fieldname].value;
    const newForm = new FormData();
    newForm.append(fieldname, updatedValue);
    updater(newForm)
      .unwrap()
      .then(() => {
        setShowEdit(false);
        setShowError(false);
        setErrorMessage("");
      })
      .catch((response) => {
        if (response.data.message) {
          if (!showError) {
            setTimeout(() => {
              setErrorMessage("");
              setShowError(false);
            }, 5000);
          }
          setErrorMessage(response.data.message);
          setShowError(true);
        }
      });
  };

  return (
    <StyledContainer className={`${className || ""} ${clickClass}`}>
      {(showEdit && (
        <StyledForm onSubmit={handleSubmit}>
          {showError && <div>{errorMessage}</div>}
          {area ? (
            <StyledTextArea
              names={fieldname}
              textValue={textValue}
              setTextValue={setTextValue}
            ></StyledTextArea>
          ) : (
            <StyledInput
              type="text"
              name={fieldname}
              defaultValue={myData[fieldname] || ""}
            />
          )}
          <StyledButtonsContainer>
            <StyledConfirm type="submit">Confirm</StyledConfirm>
            <StyledCancel type="button" onClick={() => setShowEdit(false)}>
              Cancel
            </StyledCancel>
          </StyledButtonsContainer>
        </StyledForm>
      )) ||
        (!showEdit && (
          <>
            <StyledTextStuff $fieldName={fieldname} className="textField">
              {myData[fieldname]}
            </StyledTextStuff>{" "}
            <StyledEdit onClick={() => setShowEdit(true)}>Edit</StyledEdit>
          </>
        ))}
    </StyledContainer>
  );
}

const StyledTextStuff = styled(StyledContent)<{ $fieldName?: string }>`
  word-break: break-all;
  overflow-wrap: break-word;
  text-align: ${(props) =>
    props.$fieldName === "username" ? "center" : "unset"};
`;

const StyledTextArea = styled(ExpandableTextarea)`
  width: 90%;
`;

const StyledInput = styled.input`
  width: 80%;
  padding: 3px;
`;

const StyledEdit = styled.button`
  align-self: center;
  background-color: rgb(205, 252, 255);
  border: 1px solid black;
  border-radius: 20px;
  padding: 5px 10px;
  font-weight: bold;
  &:hover {
    background-color: rgb(155, 248, 255);
  }
`;

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StyledForm = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3px;
`;

const StyledButtons = styled.button`
  padding: 3px 10px;
  &:hover {
    opacity: 0.7;
  }
`;

const StyledConfirm = styled(StyledButtons)`
  background-color: rgb(73, 186, 252);
`;

const StyledCancel = styled(StyledButtons)`
  background-color: rgb(255, 31, 31);
`;
