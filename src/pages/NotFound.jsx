import React from "react";
import { Link } from "react-router";

function NotFound(){
    return (
        <main style={{textAlign: 'center', marginTop:'50px'}}>
            <h2>404- Page Not Found</h2>
            <p>Oops! The page you are looking for does not exist or has been moved.</p>
            <Link to = "/" style = {{color:'#007bff', textDecoration:'underline'}}>
            Return to Home
            </Link>
        </main>
    );
}

export default NotFound;