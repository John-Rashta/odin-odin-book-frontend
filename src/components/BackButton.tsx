import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ButtonClickType } from "../../util/types";

export default function BackButton() {
    const navigate = useNavigate();
    const location  = useLocation();
    location.key
    const handleClick = function clickToGoBack(event: ButtonClickType) {
        if (window.history.length && window.history.length > 1 && location.key !== "default") {
            navigate(-1);
        } else {
            navigate("/");
        };
    };

    return (
        <button onClick={handleClick}>
            <ArrowLeft />
        </button>
    )
};