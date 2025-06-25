import { useUpdateMeMutation } from "../features/book-api/book-api-slice";
import usePasswordHandle from "../../util/usePasswordHandle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { isAscii } from "validator";
import PasswordConfirm from "./PasswordConfirm";
import { ExtraForm, SignupWrongInput, StyledButton, StyledContainer, StyledDivFlex, StyledInput, StyledLabel } from "../../util/style";
import styled from "styled-components";

export default function PasswordEdit() {
  const [updatePw] = useUpdateMeMutation();
  const [pwState, confirmPwState, resetPws] = usePasswordHandle();
  const navigate = useNavigate();
  const [wrongInputs, setWrongInputs] = useState(false);

  const handleSubmit = function handleFormSubmitForPasswordChange(
    event: React.FormEvent,
  ) {
    event.preventDefault();
    if (!(pwState.checkValue === confirmPwState.checkValue)) {
      return;
    }
    const currentTarget = event.target as HTMLFormElement;
    const oldPassword = currentTarget.oldPassword.value;
    const password = currentTarget.password.value;
    if (!isAscii(password) || !isAscii(oldPassword)) {
      setWrongInputs(true);
      resetPws();
      return;
    }
    const newForm = new FormData();
    newForm.append("password", password);
    newForm.append("oldPassword", oldPassword);
    updatePw(newForm)
      .unwrap()
      .then(() => {
        navigate("/profile");
      })
      .catch(() => {
        setWrongInputs(true);
        resetPws();
      });
  };
  return (
    <main>
      <StyledContainer>
        <ExtraForm onSubmit={handleSubmit}>
          {wrongInputs && (
            <StyledWrongPass>Invalid Password!</StyledWrongPass>
          )}
          <StyledDivFlex>
            <StyledLabel htmlFor="oldPassword">Current Password:</StyledLabel>
            <StyledInput type="password" id="oldPassword" name="oldPassword" />
          </StyledDivFlex>
          <PasswordConfirm
            passwordInfo={pwState}
            confirmPasswordInfo={confirmPwState}
          />
          <StyledButton type="submit">Change Password</StyledButton>
        </ExtraForm>
      </StyledContainer>
    </main>
  );
};


const StyledWrongPass = styled(SignupWrongInput)`
  left: 130px;
`;