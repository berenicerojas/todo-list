import { useRef, useState } from "react"
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styled from "styled-components";

const StyledForm = styled.form`
    padding: 1rem 0;
`;

const StyledButton = styled.button`
    font-style: ${props => props.disabled ? 'italic' : 'normal'};
    opacity: ${props => props.disabled ? .5 : 1};
`;

function TodoForm({onAddTodo, isSaving}) {
    
    const todoTitleInput = useRef(null);

    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    const handleAddTodo = (event) => {
        
        event.preventDefault();

        if (workingTodoTitle.trim()==='')return;

        onAddTodo(workingTodoTitle); 
        setWorkingTodoTitle('');
        
        if(todoTitleInput.current){
            todoTitleInput.current.focus();
        }
    } 

    return(
    <StyledForm onSubmit = {handleAddTodo}>
        <TextInputWithLabel
            id = "todoTitle"
            value = {workingTodoTitle}
            onChange ={(event) => setWorkingTodoTitle (event.target.value)}
            inputRef = {todoTitleInput}
            >
        title : 
        </TextInputWithLabel>
        <StyledButton 
            type="submit" 
            disabled={isSaving||workingTodoTitle.trim()===''}
            > 
            {isSaving ? 'Saving ...' : 'Add Todo'}
        </StyledButton>
    </StyledForm>
    );

}

export default TodoForm