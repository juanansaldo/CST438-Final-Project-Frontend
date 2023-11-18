import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <div>
            <nav className='navbar'>
                <Link to="/actors">Actors</Link> 
                <Link to="/">Movies</Link>
                <Link to="/saved-movies">Saved Movies</Link>
            </nav>
        </div>
    );
}

export default NavBar;
