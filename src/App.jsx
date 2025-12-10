import { useState } from 'react'
import './App.css'
import TodoForm from './TodoForm'
import TodoList from './TodoList';

function App() {
  const[todoList,setTodoList]= useState([]);

  const addTodo= (title)=>{
     const newTodo= {
      title,
      id: Date.now()
    };
    setTodoList((prevTodoList)=>[...prevTodoList, newTodo]);
  };

  return(
    <div className="App">
    <TodoForm onAddTodo={addTodo}/>
    <TodoList todoList={todoList}/>
    </div>
  )
}

export default App