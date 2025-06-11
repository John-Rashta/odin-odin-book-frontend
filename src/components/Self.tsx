import { useState } from "react";
import { useGetIconsQuery, useGetSelfQuery, useUpdateMeMutation } from "../features/book-api/book-api-slice";
import { useNavigate } from "react-router-dom";
import { ButtonClickType, ClickType, FormType } from "../../util/types";
import { format } from "date-fns";
import FormTextFields from "./FormTextFields";

export default function Self() {
    const { data, error, isLoading } = useGetSelfQuery();
  const [invalidSize, setInvalidSize] = useState(false);
  const [failedUpload, setFailedUpload] = useState(false);
  const [iconOptions, setIconOptions] = useState(false);
  const [updateMe] = useUpdateMeMutation();
  const {
    data: iconData,
    error: iconError,
    isLoading: iconLoading,
  } = useGetIconsQuery();
  const navigate = useNavigate();

  const handleSubmitImage = function handleSubmitingImage(event: FormType) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLFormElement;
    if (target.imageInput.files.length === 0) {
      return;
    }

    const currentFile = target.imageInput.files[0] as File;
    if (Number((currentFile.size / 1024 / 1024).toFixed(4)) > 5) {
      if (!invalidSize) {
        setTimeout(() => {
          setInvalidSize(false);
        }, 5000);
      }
      setInvalidSize(true);
      return;
    }

    const newForm = new FormData();
    newForm.append("uploaded_file", currentFile);
    updateMe(newForm)
      .unwrap()
      .then()
      .catch(() => {
        if (!failedUpload) {
          setTimeout(() => {
            setFailedUpload(false);
          }, 5000);
        }
        setFailedUpload(true);
      })
      .finally(() => {
        target.reset();
      });
  };

  const handleChangePassword = function handleClickingChangePassword(
    event: ButtonClickType,
  ) {
    event.stopPropagation();
    navigate("/password");
  };

  const handleClickIconOption = function handleClickingIconOption(
    event: ClickType,
  ) {
    event.stopPropagation();
    const target = event.target as HTMLDivElement;
    if (target.dataset.type === "ICONOPTION") {
      const possibleId = target.dataset.iconid;
      if (!possibleId) {
        return;
      }
      const newForm = new FormData();
      newForm.append("icon", possibleId);
      updateMe(newForm);
      setIconOptions(false);
    }
  };

  return (
    <main>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error Loading!</div>
      ) : data && data.user ? (
        <>
          <div>
            <img
              src={data.user.customIcon?.url || data.user.icon.source}
              alt=""
            />
            <div>
              <form
                onSubmit={handleSubmitImage}
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div>
                    <label htmlFor="imageInput">
                      Choose image for icon(max 5MB)
                    </label>
                    <input
                      type="file"
                      id="imageInput"
                      name="imageInput"
                      accept=".png,.webp,.jpeg,.jpg"
                    />
                  </div>
                  <button type="submit">Submit</button>
                  <div>
                    {failedUpload && <div>Failed to upload.</div>}
                    {invalidSize && <div>Size Over Limit!</div>}
                  </div>
                </div>
              </form>
              <div onClick={handleClickIconOption}>
                <button onClick={() => setIconOptions(!iconOptions)}>
                  Icons
                </button>
                {iconOptions && iconData && (
                  <div>
                    {iconData.icons.map((icon) => {
                      return (
                        <img
                          key={icon.id}
                          src={icon.source}
                          alt=""
                          data-iconid={icon.id}
                          data-type="ICONOPTION"
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div>Username:</div>
            <FormTextFields
              fieldname="username"
              myData={data.user}
              updater={updateMe}
            />
          </div>
          <button onClick={handleChangePassword}>
            Change Password
          </button>
          <div>
            <div>About Me:</div>
            <FormTextFields
              fieldname="aboutMe"
              myData={data.user}
              updater={updateMe}
              area={true}
            />
          </div>
          <div>Joined: {format(data.user.joinedAt, "MM/dd/yyyy")}</div>
          <div>User ID: {data.user.id}</div>
        </>
      ) : (
        <div>Something went wrong...</div>
      )}
    </main>
  );
};