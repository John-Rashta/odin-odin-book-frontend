import { RefObject, useEffect } from "react";
import { SimpleFunctionType } from "./types";

export default function useClickOutside(
  ref: RefObject<HTMLDivElement>,
  handleOutside: SimpleFunctionType,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (!ref.current) {
            return;
        };
        const currentTarget = event.target as HTMLDivElement;
        const currentRef = ref.current;
        if (
            currentRef.contains(currentTarget)
        ) {
            return;
        } else {
            handleOutside();
        }
    };

    document.addEventListener("mouseup", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  });
};
