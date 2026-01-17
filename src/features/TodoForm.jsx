import { useRef, useState } from "react"
import TextInputWithLabel from "../shared/TextInputWithLabel";

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
    <form onSubmit = {handleAddTodo}>
        <TextInputWithLabel
            id = "todoTitle"
            value = {workingTodoTitle}
            onChange ={(event) => setWorkingTodoTitle (event.target.value)}
            inputRef = {todoTitleInput}
            >
        title : </TextInputWithLabel>
        <button type="submit" disabled={isSaving||workingTodoTitle.trim()===''}> {isSaving ? 'Saving ...' : 'Add Todo'}</button>
    </form>
    );

}

export default TodoForm