import { useState, useEffect, useCallback, useReducer } from 'react'
import './App.css'
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';

import statueLibertyIcon from './assets/statueLibertyIcon.jpg';
import styles from './App.module.css';
import styled from 'styled-components';

import {
  initialState as initialTodoState,
  reducer as todosReducer,
  actions as todoActions
} from './reducers/todos.reducer';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

const ErrorIcon = styled.span`
  margin-right: 10px;
  font-size: 1.2rem;
  display: inline-block;
  vertical-align: middle;
`;

function App() {
  const [todoState, dispatch] =  useReducer(todosReducer, initialTodoState);
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const encodeUrl = useCallback(() => {
    let sortQuery =`sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = queryString ? `&filterByFormula=SEARCH("${queryString}",+title)` : "";

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  },[sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type : todoActions.fetchTodos });
    
      try {
        const resp = await fetch (encodeUrl(), {headers : {Authorization : token} });
        if (!resp.ok) throw new Error(`Error: ${resp.status}`);

        const data = await resp.json();
        const fetchedTodos = data.record.map((record) => ({
          id: record.id,
          ...record.fields,
          isCompleted: record.fields.isCompleted ?? false
        }));

        dispatch({ type : todoActions.loadTodos, payload : fetchedTodos});
      } catch (error) {
        dispatch ({ type : todoActions.setLoadError, payload : error.message});
      } 
    };
    fetchTodos();
   }, [encodeUrl]);

  const addTodo = async (title) => {
    dispatch ({ type : todoActions.startRequest });
    const payload = { records: [{ fields: { title: title, isCompleted: false } }] };
    try {
    const resp = await fetch (url,{
      method: 'POST',
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

      if (!resp.ok) throw new Error(`Failed to save: ${resp.status}`);

      const data = await resp.json();
      const savedTodo = { id: data.records[0].id, ...data.records[0].fields };
      dispatch({ type : todoActions.addTodo, payload : savedTodo});
    } catch (error) {
      dispatch({ type : todoActions.setLoadError, payload : error.message});
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find((t) => t.id === editedTodo.id);
    dispatch ({ type: todoActions.updateTodo, payload: editedTodo});

    try {
      const resp = await fetch(encodeUrl(), {
        method: 'PATCH',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify ({
        records: [{ id : editedTodo.id, fields : { title: editedTodo.title, isCompleted: editedTodo.isCompleted} }]
      }),
    });
      if (!resp.ok) throw new Error(`Update failed: ${resp.status}`);
    } catch (error) {
      dispatch ({ type : todoActions.revertTodo, payload : originalTodo });
      dispatch ({ type : todoActions.setLoadError, payload : error.message });
    }
  };

  function completeTodo(id) {
    const todoToComplete = todoState.todoList.find((todo) => todo.id === id);
    if (todoToComplete) {
      const updatedTodo = { ...todoToComplete, isCompleted: true };
      updateTodo(updatedTodo);
    }
  }

  return (
    <div className = {styles.container}>
      <header>
        <img 
        src = {statueLibertyIcon} 
        alt = "Statue Liberty Icon" 
        className = {styles.Logo} 
        />
        <h1 style={{ margin: 0}}>My Tasks</h1>
      </header>

      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

      <TodoList 
        todoList={todoState.todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo} 
        isLoading={todoState.isLoading} 
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

      {todoState.errorMessage && (
        <div className={styles.errorBox}>
          <hr />
          <p><ErrorIcon>⚠️</ErrorIcon>{todoState.errorMessage}</p>
          <button onClick={() => dispatch({ type : todoActions.clearError})}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;