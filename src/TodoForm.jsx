import { useRef } from "react"

function TodoForm({onAddTodo}){
    const todoTitleInput = useRef(null);

    const handleAddTodo = (event) =>{
        event.preventDefault()
        
        const title = event.target.title.value;
        onAddTodo(title);
        event.target.title.value = "";
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
        />
        <button>Add Todo</button>
    </form>
    );
}

export default TodoForm