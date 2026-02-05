import styled from "styled-components";

const StyledFieldContainer = styled.div`
  padding: .5rem 0;
  display: flex;
  flex-direction: column;
`;

function TextInputWithLabel({
  elementId,
  label,
  onChange,
  ref,
  value,
}) {
  return (
    <StyledFieldContainer>
      <label htmlFor={elementId}>{label}</label>
      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </StyledFieldContainer>
  );
}

export default TextInputWithLabel;