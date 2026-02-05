import { useEffect, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import styled from 'styled-components';

import styles from './TodoListItem.module.css'

const StyledButton = styled.button`
    background-color: ${props => props.type === 'submit' ? '#2ecc71' : '#e74c3c'};
    padding: 5px 10 px;
    font-size: 0.8rem;
    margin-left: 5px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

function TodoListItem ({todo, onCompleteTodo, onUpdateTodo}) {
    
    const[isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setWorkingTitle(todo.title);
    }, [todo]);
    
    const[workingTitle,setWorkingTitle] = useState(todo.title);

    const handleUpdate = (event) => {

        event.preventDefault();

        onUpdateTodo({...todo, title : workingTitle});

        setIsEditing(false);
    };

    const handleCancel = () => {

        setWorkingTitle(todo.title);
        
        setIsEditing(false);
    };

    const handleEdit = (event) => {
        
        setWorkingTitle(event.target.value);
    };

    return(
        <li className={styles.item}>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                        <TextInputWithLabel 
                            label= "Edit Todo: "
                            elementId= {`edit-${todo.id}`}
                            value = {workingTitle}
                            onChange = {handleEdit}
                        />
                        <StyledButton type="button" onClick = {handleCancel}>
                            Cancel
                        </StyledButton>
                        <StyledButton type="submit" onClick={handleUpdate}>
                            Update
                        </StyledButton>
                    </>
                ) : (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />
                        </label>
                        <span onClick = {() => setIsEditing(true)}>{todo.title}</span>
                    </>
                )}
            </form>
        </li>
    );
}

export default TodoListItem;