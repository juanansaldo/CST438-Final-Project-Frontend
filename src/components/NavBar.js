import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  const handleSearch = () => {
    onSearch(searchTerm);
    // Redirect to the searched-movies route
    history.push(`/searched-movies?keyword=${searchTerm}`);
  };
  const handleLogout = () => {
    // Implement your logout logic here
    // For example, you can clear the session storage
    sessionStorage.clear();
    // Redirect to the login page or any other desired location
    window.location.href = '/login';
  };

  return (
    <div>
      <nav className='navbar'>
        <Link to="/actors">Actors</Link> 
        <Link to="/">Movies</Link>
        <Link to="/saved-movies">Saved Movies</Link>
         <button onClick={handleLogout}>Logout</button>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
