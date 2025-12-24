import ToDoListItem from "./TodoListItem";
function TodoList({todoList, onCompleteTodo}){
  const filteredTodoList = todoList.filter((todo) => todo.isCompleted === false);
  
  return( 
    <>
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ):(
        <ul>
          {filteredTodoList.map((todo) =>(
            <ToDoListItem 
              key = {todo.id}
              todo = {todo}
              onCompleteTodo = {onCompleteTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;