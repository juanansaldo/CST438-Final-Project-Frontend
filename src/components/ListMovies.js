import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../constants';
import NavBar from './NavBar';

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
      // Add any other logic you want to perform after successfully adding the movie

      // For example, you can check if the response contains a specific message
      if (data.message) {
        console.log('Response message:', data.message);
      }
    })
    .catch((error) => {
      console.error('Error adding movie to watchlist:', error);
      // Handle the error
    });
};

function ListMovies(props) {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Called once after initial render
    fetchMovies();
  }, [currentPage]); // Update movies when the page changes

  const fetchMovies = () => {

    const jwtToken = sessionStorage.getItem('jwt');

    if (!jwtToken) {
      // Redirect to login page or handle authentication
      console.error('User not authenticated');
      return;
    }

    console.log("fetchMovies");
    fetch(`${SERVER_URL}/movies?page=${currentPage}`, {
      headers: {
        Authorization: jwtToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("movies data:", data);
        setMovies(data);
        // Scroll to the top of the page after updating movies
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Error fetching movies.');
      });
  }

  const headers = ['Poster', 'Title', 'Overview', 'Release Date', ' ', ' ', ' '];

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
      <h1>Movies</h1>
      <NavBar />

      <div className="movie-container">
        {movies.map((movie, idx) => (
          <div key={idx} className="movie-item">
            <div className="movie-poster">
              <p></p>
              <img
                src={movie.fullPosterPath} // Adjust the size as needed
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
        <button onClick={() => { handleBack(); window.scrollTo(0, 0); }} disabled={currentPage === 1}>
          Back
        </button>
        <button onClick={() => { handleNext(); window.scrollTo(0, 0); }}>Next</button>
      </div>
    </div>
  );
}

export default ListMovies;
