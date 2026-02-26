import { useState, useEffect, useCallback, useReducer } from 'react'
import {Routes, Route, useLocation } from 'react-router';
import './App.css'
import styles from './App.module.css';
import styled from 'styled-components';
import React from 'react';
import TodosPage from './pages/TodosPage';
import Header from './shared/Header';
import About from './pages/About';
import NotFound from './pages/NotFound';

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
  const [headerTitle, setHeaderTitle] = useState ("Todo List");
  const location = useLocation(); 
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  useEffect(() => {
    switch (location.pathname){
      case "/":
        setHeaderTitle("Todo List");
        break;
        case "/about":
          setHeaderTitle("About");
          break;
          default:
            setHeaderTitle("Not Found");
    }
  }, [location]);

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
      const resp = await fetch(`${url}/${editedTodo}`, {
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
      <Header title = {headerTitle}/>
      <Routes>
        <Route path = "/" element = {
          <section>
            <h2>Welcome!</h2>
            <p>Ready to Organize?</p>
          </section>
        }/>

        <Route path = "/about" element={
          <section>
            <h2>About this Project</h2>
            <p>Built for Code the Dream Week 14</p>
          </section>
        }/>

        <Route path = "/" element = {
          <TodosPage
          todoState={todoState}
          addTodo={addTodo}
          completeTodo={completeTodo}
          updateTodo={updateTodo}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          sortField={sortField}
          setSortField={setSortField}
          queryString={queryString}
          setQueryString={setQueryString}
          dispatch={dispatch}
          todoActions={todoActions}
          ErrorIcon={ErrorIcon}         
          />
        }
        />

        <Route path="/about" element={<About />}/>

        <Route path="/*" element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;