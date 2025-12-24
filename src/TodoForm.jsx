import { useRef, useState } from "react"

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
        <label htmlFor = "todoTitle">Todo</label>
        <input 
            id = "todoTitle" 
            type = "text" 
            name = "title" 
            ref = {todoTitleInput}
            value = {workingTodoTitle}
            onChange ={(event) => setWorkingTodoTitle (event.target.value)} 
        />
        <button disabled={workingTodoTitle === ''}>Add Todo</button>
    </form>
    );
}

export default TodoForm