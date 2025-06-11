import { useUpdateMeMutation } from "../features/book-api/book-api-slice";
import usePasswordHandle from "../../util/usePasswordHandle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { isAscii } from "validator";
import PasswordConfirm from "./PasswordConfirm";

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
      <div>
        <form onSubmit={handleSubmit}>
          {wrongInputs && (
            <div>Invalid Password!</div>
          )}
          <div>
            <label htmlFor="oldPassword">Current Password:</label>
            <input type="password" id="oldPassword" name="oldPassword" />
          </div>
          <PasswordConfirm
            passwordInfo={pwState}
            confirmPasswordInfo={confirmPwState}
          />
          <button type="submit">Change Password</button>
        </form>
      </div>
    </main>
  );
}