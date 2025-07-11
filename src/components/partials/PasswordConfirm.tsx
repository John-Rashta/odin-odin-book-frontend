import styled from "styled-components";
import { PwInfo } from "../../../util/interfaces";
import { StyledDivFlex, StyledInput, StyledLabel } from "../../../util/style";

export default function PasswordConfirm({
  passwordInfo,
  confirmPasswordInfo,
}: {
  passwordInfo: PwInfo;
  confirmPasswordInfo: PwInfo;
}) {
  return (
    <StyledPassContainer>
      {confirmPasswordInfo.checkValue !== "" &&
      confirmPasswordInfo.checkValue !== passwordInfo.checkValue ? (
        <StyledNoMatch>Passwords don't match!</StyledNoMatch>
      ) : null}
      <StyledDivFlex>
        <StyledLabel htmlFor="password">Password:</StyledLabel>
        <StyledInput
          type="password"
          name="password"
          id="password"
          value={passwordInfo.checkValue}
          onChange={(e) => {
            passwordInfo.changeValue(e.target.value);
          }}
          required
        />
      </StyledDivFlex>
      <StyledDivFlex>
        <StyledLabel htmlFor="confirmPassword">Confirm Password:</StyledLabel>
        <StyledInput
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPasswordInfo.checkValue}
          onChange={(e) => {
            confirmPasswordInfo.changeValue(e.target.value);
          }}
          required
        />
      </StyledDivFlex>
    </StyledPassContainer>
  );
}

const StyledPassContainer = styled(StyledDivFlex)`
  gap: 10px;
  position: relative;
`;

const StyledNoMatch = styled.div`
  position: absolute;
  top: -23px;
  left: 85px;
  font-size: 1rem;
  color: rgb(190, 3, 3);
  font-weight: bold;
`;
