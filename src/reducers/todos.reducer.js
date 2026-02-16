const actions = {
    fetchTodos : 'fetchTodos',
    loadTodos : 'loadTodos',
    setLoadError : 'setLoadError',
    startRequest : 'startRequest',
    addTodo : 'addTodo',
    endRequest : 'endRequest',
    updateTodo : 'updateTodo',
    completeTodo : 'completeTodo',
    revertTodo : 'revertTodo',
    clearError : 'clearError',
};

const initialState = {
    todoList : [],
    isLoading : true,
    isSaving : false,
    errorMessage : '',
};

function reducer(state = initialState, action){
    switch (action.type){
        case actions.fetchTodos :
            return {
                ...state,
                isLoading : true,
                errorMessage : '',
            };

        case actions.startRequest : 
        return {
            ...state,
            isSaving : true,
        };

        case actions.endRequest :
            return {
                ...state, 
                isLoading : false, 
                isSaving : false,
            };
        
        case actions.addTodo : {
            const savedTodo = {
                id : action.payload.id,
                ...action.payload.fields,
                isCompleted : action.payload.fields.isCompleted ?? false
            };
            return {
                ...state,
                todoList : [...state.todoList, savedTodo],
                isSaving : false,
            };
        }

    case actions.revertTodo :
    case actions.updateTodo : {
        const updatedTodos = state.todoList.map ((todo) => 
            todo.id === action.payload.id ? action.payload : todo
        );

        const updatedState = {
            ...state,
            todoList : updatedTodos,
        };

        if (action.error){
            updatedState.errorMessage = action.payload.error.message;
        }
        return updatedState;
    }

    case actions.completeTodo : {
        const updatedList = state.todoList.map((todo) =>
            todo.id === action.payload ? {...todo, isCompleted : true} : todo
        );
        return {
            ...state,
            todoList : updatedList,
        };
    }

    case actions.loadTodos : {
        const fetchedTodos = action.payload.map((record) => ({
            id : record.id,
            ...record.fields,
            isCompleted : record.fields.isCompleted ?? false,
        }));
        return {
            ...state,
            todoList : fetchedTodos,
            isLoading : false,
        };
    }


    case actions.setLoadError :
        return {
            ...state,
            errorMessage : action.payload,
            isLoading :  false,
            isSaving : false,
        };

    case actions.clearError :
        return {
            ...state,
            errorMessage : '',
        };
            
    default :
        return state;
    }
}

export {initialState, reducer, actions};