import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../features/book-api/book-api-slice";
import isAscii from "validator/lib/isAscii";
import isAlphanumeric from "validator/lib/isAlphanumeric";
import usePasswordHandle from "../../util/usePasswordHandle";
import PasswordConfirm from "./PasswordConfirm";
import { ExtraForm, SignupWrongInput, StyledButton, StyledContainer, StyledDivFlex, StyledForm, StyledInput, StyledLabel, StyledWrongInput } from "../../util/style";

export default function SignUp() {
  const [createUser] = useCreateUserMutation();
  const navigate = useNavigate();
  const [wrongInputs, setWrongInputs] = useState(false);
  const [pwState, confirmPwState, resetPws] = usePasswordHandle();

  const handleForm = function handleFormSubmitting(event: React.FormEvent) {
    event.preventDefault();
    if (!(pwState.checkValue === confirmPwState.checkValue)) {
      return;
    }
    const currentTarget = event.target as HTMLFormElement;
    const username = currentTarget.username.value;
    const password = currentTarget.password.value;
    if (!isAlphanumeric(username) || !isAscii(password)) {
      setWrongInputs(true);
      resetPws();
      return;
    }

    createUser({ username, password })
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((response) => {
        console.log(response);
        setWrongInputs(true);
        resetPws();
      });
  };
  return (
    <main>
      <StyledContainer>
        <ExtraForm onSubmit={handleForm}>
          {wrongInputs ? (
            <SignupWrongInput>Username or Password wrong!</SignupWrongInput>
          ) : null}
          <StyledDivFlex>
            <StyledLabel htmlFor="username">Username:</StyledLabel>
            <StyledInput
              type="text"
              name="username"
              id="username"
              placeholder="Only Letters and/or Numbers"
              required
            />
          </StyledDivFlex>
          <PasswordConfirm
            passwordInfo={pwState}
            confirmPasswordInfo={confirmPwState}
          />
          <StyledButton type="submit">Sign Me Up!</StyledButton>
        </ExtraForm>
      </StyledContainer>
    </main>
  );
};