import { useState } from "react";
import { ReturnMessage, UserInfo } from "../../util/interfaces";
import { FormType, MutationTriggerType } from "../../util/types";

type FieldNameOptions = "username" | "aboutMe";

export default function FormTextFields({
  myData,
  fieldname,
  updater,
  area,
  className,
}: {
  myData: UserInfo;
  fieldname: FieldNameOptions;
  updater: MutationTriggerType<FormData, ReturnMessage>;
  area?: boolean;
  className?: string;
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = function handleClickingEditSubmit(event: FormType) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLFormElement;
    const updatedValue = target[fieldname].value;
    const newForm = new FormData();
    newForm.append(fieldname, updatedValue);
    updater(newForm)
      .unwrap()
      .then(() => {
        setShowEdit(false);
        setShowError(false);
        setErrorMessage("");
      })
      .catch((response) => {
        if (response.data.message) {
          if (!showError) {
            setTimeout(() => {
              setErrorMessage("");
              setShowError(false);
            }, 5000);
          }
          setErrorMessage(response.data.message);
          setShowError(true);
        }
      });
  };

  return (
    <div className={className}>
      {(showEdit && (
        <form onSubmit={handleSubmit}>
          {showError && <div>{errorMessage}</div>}
          <label htmlFor={fieldname}></label>
          {area ? (
            <textarea
              name={fieldname}
              id={fieldname}
              defaultValue={myData[fieldname] || ""}
            ></textarea>
          ) : (
            <input
              type="text"
              name={fieldname}
              id={fieldname}
              defaultValue={myData[fieldname] || ""}
            />
          )}
          <button type="submit">Confirm</button>
          <button type="button" onClick={() => setShowEdit(false)}>
            Cancel
          </button>
        </form>
      )) ||
        (!showEdit && (
          <>
            <div className="textField">{myData[fieldname]}</div>{" "}
            <button onClick={() => setShowEdit(true)}>
              Edit
            </button>
          </>
        ))}
    </div>
  );
}