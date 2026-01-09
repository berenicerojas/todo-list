///I erased my code and had to recover it. This is my week 6 assignment
import { useState } from 'react'
import './App.css'
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);

  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return{...editedTodo };
      }
      return todo;
    });
      setTodoList(updatedTodos);
  };

  function completeTodo(id){
    const updatedTodos = todoList.map((todo) =>
      todo.id === id ? {todo, isCompleted : true}: todo
    );
    setTodoList(updatedTodos);
  }

  const addTodo = (title)=>{
     const newTodo = {
      title,
      id: Date.now(),
      isCompleted : false,
    };
    setTodoList((prevTodoList) => [...prevTodoList, newTodo]);
  };

  return(
    <div className = "App">
    <TodoForm onAddTodo = {addTodo}/>
    <TodoList 
      todoList = {todoList}
      onCompleteTodo = {completeTodo}
      onUpdateTodo = {updateTodo}
      />
    </div>
  );
}


export default App;