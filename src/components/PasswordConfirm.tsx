import { PwInfo } from "../../util/interfaces";

export default function PasswordConfirm({
  passwordInfo,
  confirmPasswordInfo,
}: {
  passwordInfo: PwInfo;
  confirmPasswordInfo: PwInfo;
}) {
  return (
    <div>
      {confirmPasswordInfo.checkValue !== "" &&
      confirmPasswordInfo.checkValue !== passwordInfo.checkValue ? (
        <div>Passwords don't match!</div>
      ) : null}
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={passwordInfo.checkValue}
          onChange={(e) => {
            passwordInfo.changeValue(e.target.value);
          }}
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPasswordInfo.checkValue}
          onChange={(e) => {
            confirmPasswordInfo.changeValue(e.target.value);
          }}
          required
        />
      </div>
    </div>
  );
}