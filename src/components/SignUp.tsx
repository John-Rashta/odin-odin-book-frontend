import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../features/book-api/book-api-slice";
import isAscii from "validator/lib/isAscii";
import isAlphanumeric from "validator/lib/isAlphanumeric";
import usePasswordHandle from "../../util/usePasswordHandle";
import PasswordConfirm from "./PasswordConfirm";

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
      <div>
        <form onSubmit={handleForm}>
          {wrongInputs ? (
            <div>Username or Password wrong!</div>
          ) : null}
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Only Letters and/or Numbers"
              required
            />
          </div>
          <PasswordConfirm
            passwordInfo={pwState}
            confirmPasswordInfo={confirmPwState}
          />
          <button type="submit">Sign Me Up!</button>
        </form>
      </div>
    </main>
  );
}