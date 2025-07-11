import styled from "styled-components";

export default function Footer() {
  return (
    <StyledFooter>
      <div>Project for The Odin Project</div>
      <div>2025</div>
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  padding: 15px 10px;
  background-color: rgb(209, 252, 255);
  font-size: 1.1rem;
`;
