import ToDoListItem from "./TodoListItem";
function TodoList({todoList}){
    return(
      <ul>
        {todoList.map(todo =>(
          <ToDoListItem 
            key={todo.id}
            todo={todo}
          />
        ))}
    </ul>
  );
}

export default TodoList;