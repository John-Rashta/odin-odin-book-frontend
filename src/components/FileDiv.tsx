import { useRef, useState } from "react";
import { StyledCancelFile, StyledFileDiv, StyledFileLabel, StyledFileName, StyledInputFile } from "../../util/style";
import styled from "styled-components";
import { Image } from "lucide-react";

export default function FileDiv({invalidSize} : {invalidSize: boolean}) {
    const [fileName, setFileName] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);
    return (
        <StyledFileDiv>
            <StyledFileName>
            {fileName}
            {fileName !== "" ? <StyledCancelFile
            onClick={() => {
                if (fileRef.current) {
                fileRef.current.value = "";
                setFileName("");
                }
            }}
            >
                X
            </StyledCancelFile> : ""}
            </StyledFileName>
            {invalidSize && (
            <StyledFileError>File Too Big! (Max 5MB)</StyledFileError>
            )}
            <StyledFileLabel>
            <Image />
            <StyledInputFile
            ref={fileRef}
            onChange={(e) => {
            if (e.target.files) {
                setFileName(e.target.files[0].name)
            }
            }}
            type="file" 
            name="fileInput" 
            />
            </StyledFileLabel>
        </StyledFileDiv>
    )
};

const StyledFileError = styled.div`
  position: absolute;
  bottom: -50px;
  left: 30px;
  min-width: 100px;
  color: rgb(206, 0, 0);
`;