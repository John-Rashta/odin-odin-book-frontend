import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ButtonClickType } from "../../../../util/types";
import { clickClass } from "../../../../util/globalValues";

export default function BackButton({ className }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = function clickToGoBack(event: ButtonClickType) {
    if (
      window.history.length &&
      window.history.length > 1 &&
      location.key !== "default"
    ) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${className || ""} ${clickClass}`}
    >
      <ArrowLeft />
    </button>
  );
}
