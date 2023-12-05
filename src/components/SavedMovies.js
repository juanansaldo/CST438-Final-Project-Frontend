import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../constants';
import NavBar from './NavBar';
import Button from '@mui/material/Button';

function SavedMovies() {
  const [savedMovies, setSavedMovies] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSavedMovies();
  }, []);

  const fetchSavedMovies = () => {
    const jwtToken = sessionStorage.getItem('jwt');

    if (!jwtToken) {
      console.error('User not authenticated');
      return;
    }

    fetch(`${SERVER_URL}/userMoviesToWatch`, {
      headers: {
        Authorization: jwtToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('saved movies data:', data);
        setSavedMovies(data);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Error fetching saved movies.');
      });
  };

  const formatReleaseDate = (date) => {
    if (!date) {
      return ''; // or any default value you prefer
    }

    const releaseDate = new Date(date);
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };

    return releaseDate.toLocaleDateString('en-US', options);
  }

  const removeMovie = (movieTitle) => {
    setMessage('');
    
    const jwtToken = sessionStorage.getItem('jwt');
    if (!jwtToken) {
      console.error('User not authenticated');
      setMessage('User not authenticated.');
      return;
    }
    
    fetch(`${SERVER_URL}/deleteFromWatch/${encodeURIComponent(movieTitle)}`, {
      method: 'DELETE',
      headers: {
        Authorization: jwtToken,
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      if (res.ok) {
        setMessage('Movie dropped from watch list.');
        fetchSavedMovies(); // Refresh the list of saved movies
      } else {
        console.error('Error removing movie: ' + res.status);
        setMessage(`Error removing movie. Status: ${res.status}`);
      }
    })
    .catch((err) => {
      console.error('Exception while removing movie: ' + err);
      setMessage(`Exception while removing movie: ${err.message}`);
    });
  };  

  return (
    <div>
      <h1>Watch List</h1>
  

      <div className="movie-container">
        {savedMovies.map((movie, idx) => (
          <div key={idx} className="movie-item">
            <div className="movie-poster">
              <img
                src={movie.posterPath} // Adjust the size as needed
                alt={`Poster for ${movie.movieTitle}`}
              />
            </div>
            <div className="movie-details">
              <h4>{movie.movieTitle}</h4>
              <p>Release Date: {formatReleaseDate(movie.releaseDate)}</p>
              <p>--------------Plot--------------</p>
              <p>{movie.movieOverview}</p>
              <p>--------------------------------</p>
              <Button variant="outlined" onClick={() => removeMovie(movie.movieTitle)}>Remove</Button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedMovies;