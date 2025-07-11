import React, { useState } from "react";
import { setMyId } from "../../features/manager/manager-slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../features/book-api/book-api-slice";
import isAscii from "validator/lib/isAscii";
import isAlphanumeric from "validator/lib/isAlphanumeric";
import { setAuthState } from "../../features/auth/auth-slice";
import { socket } from "../../../sockets/socket";
import styled from "styled-components";
import {
  StyledButton,
  StyledContainer,
  StyledForm,
  StyledInput,
  StyledLabel,
  StyledWrongInput,
} from "../../../util/style";
import { ButtonClickType } from "../../../util/types";

export default function Login() {
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [wrongInputs, setWrongInputs] = useState(false);

  const handleForm = function handleFormSubmitting(event: React.FormEvent) {
    event.preventDefault();
    const currentTarget = event.target as HTMLFormElement;
    const username = currentTarget.username.value;
    const password = currentTarget.password.value;
    if (!isAlphanumeric(username) || !isAscii(password)) {
      setWrongInputs(true);
      return;
    }

    loginUser({ username, password })
      .unwrap()
      .then((result) => {
        socket.connect();
        dispatch(setMyId(result.id));
        dispatch(setAuthState(true));
        navigate("/");
      })
      .catch(() => {
        setWrongInputs(true);
      });
  };

  const handleGuest = function handleEnteringAsGuest(event: ButtonClickType) {
    socket.connect();
    dispatch(setMyId("guest"));
    dispatch(setAuthState(true));
    navigate("/");
  };

  return (
    <main>
      <StyledCentral>
        <StyledForm onSubmit={handleForm}>
          {wrongInputs ? (
            <StyledWrongInput>Username or Password wrong!</StyledWrongInput>
          ) : null}
          <StyledLabel htmlFor="username">Username:</StyledLabel>
          <StyledInput type="text" name="username" id="username" required />
          <StyledLabel htmlFor="password">Password:</StyledLabel>
          <StyledInput type="password" name="password" id="password" required />
          <StyledButton type="submit">Login</StyledButton>
        </StyledForm>
        <StyledGuestButton onClick={handleGuest}>
          Enter As Guest
        </StyledGuestButton>
      </StyledCentral>
    </main>
  );
}

const StyledGuestButton = styled.button`
  padding: 5px 10px;
  background-color: rgb(152, 205, 255);
  &:hover {
    background-color: rgb(97, 179, 255);
  }
`;

const StyledCentral = styled(StyledContainer)`
  flex-direction: column;
  gap: 10px;
`;
