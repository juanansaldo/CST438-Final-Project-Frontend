import React, { useState, useEffect, useCallback } from 'react';
import { SERVER_URL } from '../constants';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';

const formatReleaseDate = (date) => {
  if (!date) {
    return ''; // or any default value you prefer
  }

  const releaseDate = new Date(date);
  const options = { month: '2-digit', day: '2-digit', year: 'numeric' };

  return releaseDate.toLocaleDateString('en-US', options);
};

const handleAddToWatchlist = (movie) => {
  const jwtToken = sessionStorage.getItem('jwt');

  if (!jwtToken) {
    console.error('User not authenticated');
    return;
  }

  const addToWatchlistData = {
    movieTitle: movie.original_title,
    movieOverview: movie.overview,
    releaseDate: movie.release_date,
    posterPath: movie.fullPosterPath,
  };

  fetch(`${SERVER_URL}/addToWatch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: jwtToken,
    },
    body: JSON.stringify(addToWatchlistData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Movie added to watchlist:', data);

      if (data.message) {
        console.log('Response message:', data.message);
      }
    })
    .catch((error) => {
      console.error('Error adding movie to watchlist:', error);
    });
};

function SearchedMovies() {
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const location = useLocation();

  const fetchSearchedMovies = useCallback(async () => {
    const jwtToken = sessionStorage.getItem('jwt');

    if (!jwtToken) {
      console.error('User not authenticated');
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const newKeyword = searchParams.get('keyword') || '';

    if (newKeyword !== keyword) {
      // Reset currentPage when the keyword changes
      setCurrentPage(1);
    }

    setKeyword(newKeyword);

    try {
      const response = await fetch(`${SERVER_URL}/moviesSearched?keyword=${newKeyword}&page=${currentPage}`, {
        headers: {
          Authorization: jwtToken,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching searched movies.');
      }

      const data = await response.json();
      console.log('searched movies data:', data);
      setMovies(data);
    } catch (err) {
      console.error(err);
      setMessage('Error fetching searched movies.');
    }
  }, [currentPage, keyword, location.search]);

  useEffect(() => {
    fetchSearchedMovies();
  }, [fetchSearchedMovies]);

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <h1>Searched Movies</h1>

      <div className="movie-container">
        {movies.map((movie, idx) => (
          <div key={idx} className="movie-item">
            <div className="movie-poster">
              <p></p>
              <img
                src={movie.fullPosterPath}
                alt={`Poster for ${movie.original_title}`}
              />
            </div>
            <div className="movie-details">
              <h4>{movie.original_title}</h4>
              <p>Release Date: {formatReleaseDate(movie.release_date)}</p>
              <p>--------------Plot--------------</p>
              <p>{movie.overview}</p>
              <p>--------------------------------</p>
              <p>Rating: {movie.vote_average}</p>
              <button onClick={() => handleAddToWatchlist(movie)}>Add to Watchlist</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Button variant="outlined" color="primary" onClick={() => { handleBack(); window.scrollTo(0, 0); }} disabled={currentPage === 1}>
          Back
        </Button>
        <Button variant="outlined" color="primary" onClick={() => { handleNext(); window.scrollTo(0, 0); }}>Next</Button>
      </div>
    </div>
  );
}

export default SearchedMovies;
