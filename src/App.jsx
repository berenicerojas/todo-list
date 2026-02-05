import { useState, useEffect, useCallback } from 'react'
import './App.css'
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [errorMessage, setErrorMessage] = useState ("");
  const [isLoading, setIsLoading] = useState (false);
  const [todoList, setTodoList] = useState([]);
  const [isSaving, setIsSaving] = useState (false);
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const encodeUrl = useCallback(()=>{
    let sortQuery =`sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery ="";

    if (queryString){
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  },[sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method : "GET",
        headers : { Authorization : token },
      };
    
      try {
        const resp = await fetch (encodeUrl(), options);
        if (!resp.ok) throw new Error(`Error: ${resp.status}`);

        const data = await resp.json();
        const fetchedTodos = data.records.map((records) => ({
          id: records.id,
          ...records.fields,
          isCompleted: records.fields.isCompleted ?? false
        }));

        setTodoList(fetchedTodos);
      } catch (error) {
        setErrorMessage (error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
   }, [encodeUrl]);

  const addTodo = async (title) => {
    const payload = { records: [{ fields: { title: title, isCompleted: false } }] };
    const options = {
      method: 'POST',
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(encodeUrl(), options);
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
      const resp = await fetch(encodeUrl(), {
        method: 'PATCH',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`Update failed: ${resp.status}`);
    } catch (error) {
      setErrorMessage(`${error.message}. Reverting changes...`);
      setTodoList((prevTodoList) => 
        prevTodoList.map((todo) => 
          todo.id === editedTodo.id ? originalTodo : todo
      )
    );
    }
  }

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
      <hr />
      <TodosViewForm
      sortDirection={sortDirection}
      setSortDirection={setSortDirection}
      sortField={sortField}
      setSortField={setSortField}
      queryString={queryString}
      setQueryString={setQueryString}
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