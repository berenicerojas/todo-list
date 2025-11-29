import { useState } from 'react'
import './App.css'
import TodoForm from './TodoForm'
import './TodoForm'
import TodoList from './TodoList'
import './TodoList'

function App() {
  const[newTodo,setNewTodo]= useState('Visible text')

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm/> 
      <p>{newTodo}</p>
      <TodoList/>
    </div>
  )
}

export default App