import { useRef, useState } from "react"
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({onAddTodo}){
    const todoTitleInput = useRef(null);

    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    const handleAddTodo = (event) => {
        event.preventDefault();

        onAddTodo(workingTodoTitle); 
        setWorkingTodoTitle('');
        todoTitleInput.current.focus();
    } 

    return(
    <form onSubmit = {handleAddTodo}>
        <button disabled={workingTodoTitle === ''}>Add Todo</button>
        <TextInputWithLabel
            label = "Todo"
            elementId = "todoTitle"
            ref = {todoTitleInput}
            value = {workingTodoTitle}
            onChange ={(event) => setWorkingTodoTitle (event.target.value)} 
        />
    </form>
    );
}

export default TodoForm