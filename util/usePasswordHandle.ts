import { useState } from "react";
import { PwInfo } from "./interfaces";
import { SimpleFunctionType } from "./types";

export default function usePasswordHandle() {
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  type PassHandle = [PwInfo, PwInfo, SimpleFunctionType];

  function resetPasswords() {
    setPasswordValue("");
    setConfirmPasswordValue("");
  }

  return [
    {
      checkValue: passwordValue,
      changeValue: setPasswordValue,
    },
    {
      checkValue: confirmPasswordValue,
      changeValue: setConfirmPasswordValue,
    },
    resetPasswords,
  ] as PassHandle;
};
