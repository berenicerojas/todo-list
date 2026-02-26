import React from "react";
import { NavLink } from "react-router";
import styles from "./Header.module.css";

function Header ({title}){
    const getNavLinkClass = ({isActive}) => (isActive ? "active" : "inactive");
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <nav className={styles.navBar}>
                <ul className={styles.navList}>
                    <li>
                        <NavLink to = "/" className={({isActive}) => (isActive ? styles.active : styles.inactive)}
                        >
                        Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to = "/about" className={({isActive}) => (isActive ? styles.active : styles.inactive)}
                        >
                        About
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;