import { SimpleFunctionType } from "../../util/types";
import useClickOutside from "../../util/useClickOutside";
import { clickClass } from "../../util/globalValues";

export default function ClickOutsideWrapper(props: React.ComponentPropsWithoutRef<"div"> & {className?: string, closeFunc: SimpleFunctionType, divRef: React.RefObject<HTMLDivElement>}) {
    const { children, className, divRef, closeFunc, ...restProps} = props;
    useClickOutside(divRef, closeFunc);
    return (
        <div className={`${className || ""} ${clickClass}`} {...restProps}>
            {children}
        </div>
    );
};