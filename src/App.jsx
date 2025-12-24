///I erased my code and had to recover it. This is my week 6 assignment
import { useState } from 'react'
import './App.css'
import TodoForm from './TodoForm'
import TodoList from './TodoList';

function App() {
  const [todoList, setTodoList] = useState([]);

  function completeTodo(id){
    const updatedTodos = todoList.map((todo) =>{
      if(todo.id === id){
        return {...todo, isCompleted: true};
      }
      return todo;
    });
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
    />
    </div>
  );
}

export default App