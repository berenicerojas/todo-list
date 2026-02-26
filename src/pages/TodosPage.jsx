import React,{useEffect} from "react";
import TodoList from "../features/TodoList/TodoList";
import TodoForm from "../TodoForm";
import TodoViewForm from "../features/TodosViewForm";
import styles from "../App.module.css";
import { useSearchParams, useNavigate } from "react-router";

function TodosPage ({
    todoState,
    addTodo,
    completeTodo,
    updateTodo,
    sortDirection,
    setSortDirection,
    sortField,
    setSortField,
    queryString,
    setQueryString,
    dispatch,
    todoActions,
    ErrorIcon
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const itemsPerPage = 15;

    const filteredTodoList = todoState.todoList.filter((todo) => !todo.isCompleted);
    const currentPage = parseInt (searchParams.get('page') || '1', 10);
    const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil(filteredTodoList.length/itemsPerPage);

    const currentTodos = filteredTodoList.slice(
        indexOfFirstTodo,
        indexOfFirstTodo + itemsPerPage
    );

    const handlePreviousPage = () => {
        if (currentPage > 1){
            setSearchParams({ page : currentPage - 1});
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages){
            setSearchParams({ page : currentPage + 1});
        }
    };

    useEffect (() => {
        if (totalPages > 0){
            const isInvalidPage = isNaN(currentPage) || currentPage < 1 || currentPage > totalPages;
            if (isInvalidPage){
                navigate ("/");
            }
        }
    },[currentPage, totalPages, navigate]);

    return (
        <>
        <TodoForm onAddTodo = {addTodo} isSaving = {todoState.isSaving}/>
        <TodoList 
            todoList={currentTodos}
            onCompleteTodo={completeTodo}
            onUpdateTodo={updateTodo}
            isLoading={todoState.isLoading}
        />
        <div className = "paginationControls" style = {{
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            gap:'15px',
            margin: '20px 0'
            }}>
                <button 
                onClick = {handlePreviousPage}
                disabled = {currentPage === 1}
                >
                    Previous
                </button>
            <span> Page {currentPage} of {totalPages || 1}</span>
            <button
            onClick = {handleNextPage}
            disabled = {currentPage === totalPages || totalPages === 0}
            >
                Next
            </button>
        </div>

        <hr />
        <TodoViewForm 
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
        />

        {todoState.errorMessage &&(
            <div className = {styles.errorBox}>
                <hr />
                <p><ErrorIcon></ErrorIcon>{todoState.errorMessage}</p>
                <button onClick = {() => dispatch({ type: todoActions.clearError})}>
                Dismiss
                </button>
            </div>
        )}
        </>
    );
}

export default TodosPage;