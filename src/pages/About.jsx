import React from "react";

function About(){
    return(
        <main>
            <h2>About this Project</h2>
            <p>
                This todo list application was built as part of the Code the Dream
                React curriculum. It leverages Airtable as a backend to persist data
                and React Router for seamless navigation.
            </p>
            <p>
                <strong>Author:Berenice</strong>
            </p>
            <p>
                The goal of this project is to demonstrate proficiency in React hooks
                like <code>useReducer</code>, <code>useCallback</code>, and <code>useEffect</code>,
                as well as complex state management and API
            </p>
        </main>
    );
}

export default About;