import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

const mainBackgroundColor = `rgb(255, 255, 255)`;
const navMenuValue = `1010px`;
const headerPadding = `20px 10px`;
const headerBackgroundColor = `rgb(216, 241, 250)`;
const headerBorderBottom = `2px solid black`;

const StyledNavLink = styled(NavLink)`
  border: solid transparent 2px;
  border-radius: 3px;
  text-decoration: none;
  &:hover {
    border-color: rgb(0, 0, 0);
  }
  padding: 8px;
  &.active {
    background-color: rgb(68, 191, 240);
  }
`;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 8px;
  border: 1px solid black;
  padding: 25px;
  background-color: rgb(175, 226, 255);
  width: 350px;
`;

const StyledInput = styled.input`
  padding: 3px;
`;

const StyledLabel = styled.label`
  font-size: 1.1rem;
`;

const StyledWrongInput = styled.div`
  position: absolute;
  top: -50px;
  left: 60px;
  width: 150%;
  font-size: 1.1rem;
`;

const StyledButton = styled.button`
  align-self: center;
  padding: 3px 10px;
  margin-top: 10px; 
  background-color: rgb(255, 255, 255);
  border: 2px solid rgb(0, 83, 138);
  font-size: 0.9rem;
  color: rgb(19, 109, 168);
  font-weight: 600;
`;

const StyledDivFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExtraForm = styled(StyledForm)`
  width: 400px;
  gap: 40px;
`;

const SignupWrongInput = styled(StyledWrongInput)`
  left: 90px;
`;

const StyledErrorMessage = styled.div`
  align-self: center;
  font-size: 1.4rem;
`;

const StylesReturn = css`
  display: flex;
  gap: 20px;
  box-shadow: 0 -1px 0 black;
  justify-content: space-between;
  padding: 20px;
`;

const StyledReturn = styled.div`
  ${StylesReturn}
`;

const StyledMain = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StyledDefaultContainer = styled.div`
    border-left: 2px solid black;
    border-right: 2px solid black;
    max-width: 700px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    padding-top: 50px;
`;

const StyledMainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StyledClickButton = styled.button<{
  $currentType?: string;
  $trueType?: string;
}>`
  background-color: ${(props) =>
    (props.$currentType === props.$trueType && "rgb(51, 163, 255)") ||
    "rgb(219, 245, 252)"};
  padding: 10px 20px;
  font-weight: bold;
  font-size: 1rem;
`;

const StyledUsername = styled.div`
    cursor: pointer;
    &:hover {
        text-decoration-line: underline;
    };
`;

const StyledImage = styled.img`
    cursor: pointer;
    &:hover {
        opacity: 0.9;
    };
`;

const StyledMessageImage = styled.img`
  max-width: 50%;
  height: auto;
  object-fit: contain;
`;

const StyledLoadCSS = css`
    padding: 5px 15px;
    background-color: rgb(195, 214, 255);
    border: 1px solid black;
    &:hover {
        background-color: rgb(150, 184, 255);
    };
    font-weight: bold;
    margin: 15px;
`;

const StyledBackCSS = css`
    align-self: start;
    border: none;
    cursor: pointer;
    background-color: transparent;
    &:hover {
       background-color: rgb(121, 192, 255);
    };
`;

const StyledUserBlue = styled(StyledUsername)`
    color: rgb(32, 136, 255);
`;

const StyledFlex = styled.div`
    display: flex;
    gap: 5px;
`;

const StyledContent = styled.div`
    white-space: pre-line;
    word-break: break-all;
    overflow-wrap: break-word;
`;

const StyledCancel = styled.button`
    background-color: rgb(166, 237, 255);
    border-radius: 20px;
    &:hover {
        background-color: rgb(128, 229, 255);
    };
`;

const StyledConfirm = styled.button`
    background-color: rgb(193, 222, 255);
    border-radius: 20px;
    &:hover {
        background-color: rgb(155, 202, 255);
    };
`;

const StyledEdited = styled.div`
    font-size: 0.8rem;
`;

const StyledCounts = styled.div`
 font-size: 0.9rem;
`;

const StyledInputFile = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
`;

const StyledFileLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;


const StyledFileDiv = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
`;

const StyledCancelFile = styled.button`
  background-color: rgb(255, 209, 209);
  &:hover {
     background-color: rgb(255, 185, 185);
  };
  
`;

const StyledFileName = styled.div`
  max-width: 90%;
  position: absolute;
  bottom: 0;
  top: 0;
  left:  30px;
  display: flex;
  gap: 5px;
  word-break: break-all;
  overflow-wrap: break-word;
`;


export {
    mainBackgroundColor,
    navMenuValue,
    StyledNavLink,
    headerBackgroundColor,
    headerPadding,
    headerBorderBottom,
    StyledButton,
    StyledContainer,
    StyledForm,
    StyledInput,
    StyledLabel,
    StyledWrongInput,
    StyledDivFlex,
    ExtraForm,
    SignupWrongInput,
    StyledErrorMessage,
    StyledReturn,
    StyledDefaultContainer,
    StyledMain,
    StyledMainContainer,
    StylesReturn,
    StyledClickButton,
    StyledImage,
    StyledUsername,
    StyledMessageImage,
    StyledLoadCSS,
    StyledBackCSS,
    StyledUserBlue,
    StyledFlex,
    StyledContent,
    StyledCancel,
    StyledConfirm,
    StyledCounts,
    StyledEdited,
    StyledFileDiv,
    StyledFileLabel,
    StyledInputFile,
    StyledCancelFile,
    StyledFileName,
};