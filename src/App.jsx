///I erased my code and had to recover it. This is my week 6 assignment
import { useState, useEffect } from 'react'
import './App.css'
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [errorMessage, setErrorMessage] = useState ("");
  const [isLoading, setIsLoading] = useState (false);
  const [todoList, setTodoList] = useState([]);
  const [isSaving, setIsSaving] = useState (false);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method : "GET",
        headers : { Authorization : token },
      };
    
      try {
        const resp = await fetch (url, options);
        if (!resp.ok){
          throw new Error(`Error: ${resp.status} ${resp.statusText}`);
        }

        const data = await resp.json();
        const fetchedTodos = data.records.map((records) => {
          const todo = {
            id : records.id,
            ...records.fields,
          };

          if (todo.isCompleted === undefined) todo.isCompleted = false;
          return todo;
        });

        setTodoList(fetchedTodos);
      } catch (error) {
        setErrorMessage (error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
   }, []);

  const addTodo = async (title) => {
    const payload = { records: [{ fields: { title: title, isCompleted: false } }] };
    const options = {
      method: 'POST',
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(`Failed to save: ${resp.status}`);
      const data = await resp.json();
      const savedTodo = { id: data.records[0].id, ...data.records[0].fields };
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    
    setTodoList(todoList.map((todo) => (todo.id === editedTodo.id ? editedTodo : todo)));

    const payload = {
      records: [{ id: editedTodo.id, fields: { title: editedTodo.title, isCompleted: editedTodo.isCompleted } }],
    };

    try {
      const resp = await fetch(url, {
        method: 'PATCH',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`Update failed: ${resp.status}`);
    } catch (error) {
      setErrorMessage(`${error.message}. Reverting changes...`);
      setTodoList(todoList.map((todo) => (todo.id === editedTodo.id ? originalTodo : todo)));
    }
  };

  function completeTodo(id) {
    const todoToComplete = todoList.find((todo) => todo.id === id);
    if (todoToComplete) {
      const updatedTodo = { ...todoToComplete, isCompleted: true };
      updateTodo(updatedTodo);
    }
  }

  return (
    <div className="App">
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo} 
        isLoading={isLoading} 
      />
      {errorMessage && (
        <div className="error-box">
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;