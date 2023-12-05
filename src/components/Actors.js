import React, { useState, useEffect} from 'react';
import { SERVER_URL } from '../constants';
import './Actors.css';
import NavBar from './NavBar';
import EditActor from './EditActor';
import AddActor from './AddActor';
import './Actors.css'
import Button from '@mui/material/Button';

const Actors = () => {

    const [actors, setActors] = useState([]);
    const [message, setMessage] = useState('');
    const jwtToken = sessionStorage.getItem('jwt');

    useEffect(() => {
        // Called once after initial render
        fetchActors();
      }, []);
    
    const fetchActors = () => {
        if (!jwtToken) {
          // Redirect to login page or handle authentication
          console.error('User not authenticated');
          return;
        }
    
        console.log("Fetch Actors");
        fetch(`${SERVER_URL}/actors`, {
          headers: {
            Authorization: jwtToken
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("actors data:", data);
            setActors(data);
          })
          .catch((err) => {
            console.error(err);
            setMessage('Error fetching actors.');
          });
    }

    const addActor = (name, dob, portrait, about) => {
        setMessage('');
        fetch(`${SERVER_URL}/actors`, {
          method: 'POST',
          headers: {
            Authorization: jwtToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name, dob: dob, portrait: portrait, about: about }),
        })
          .then((res) => {
            if (res.ok) {
              setMessage('Actor added.');
              fetchActors();
            } else {
              console.error('error addActor ' + res.status);
              setMessage('Error. ' + res.status);
            }
          })
          .catch((err) => {
            console.error('exception addActor ' + err);
            setMessage('Exception. ' + err.message);
          });
    };
    
    const editActor = (actorId, name, dob, portrait, about) => {
        setMessage('');
        fetch(`${SERVER_URL}/actors/${actorId}`, {
          method: 'PUT',
          headers: {
            Authorization: jwtToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name, dob: dob, portrait: portrait, about: about }),
        })
          .then((res) => {
            if (res.ok) {
              setMessage('Actor updated.');
              fetchActors();
            } else {
              console.error('error updateActor ' + res.status);
              setMessage('Error. ' + res.status);
            }
          })
          .catch((err) => {
            console.error('exception updateActor ' + err);
            setMessage('Exception. ' + err.message);
          });
    };

    const deleteActor = (actorId) => {
      setMessage('');

      fetch(`${SERVER_URL}/actors/${actorId}`, {
        method: 'DELETE',
        headers: {Authorization: jwtToken,
                  'Content-Type': 'application/json'
        }
      })
      .then((res) => {
          if (res.ok) {
            setMessage('Actor dropped.');
            fetchActors();
          } else {
            console.error('error deleteActor ' + res.status);
            setMessage('Error. ' + res.status);
          }
      })
      .catch((err) => {
          console.error('exception dropActor ' + err);
          setMessage('Exception. ' + err.message);
      });
    };

    const calculateAge = (dob) => {
      const birthDate = new Date(dob);
      const currentDate = new Date();
      let age = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDifference = currentDate.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
          age--;
      }

      return age;
    }

    return (
      <div>
        <h1>Actors</h1>
        
            
        {message && <p>{message}</p>}
        
        <AddActor addActor={addActor} />
        
        <div className="actors-container">
          <ul>
            {actors.map((actor, index) => (
              <li key={index} className="actor-item">
                <div className="actor-details">
                  <div className="actor-info">
                    <h3>{actor.name}</h3>
                    <p>Age: {calculateAge(actor.dob)}</p> {/* Updated this line */}
                    <img className='actorImg' src={actor.portrait} alt={actor.name}></img>
                    <p>{actor.about}</p>
                    <div className='buttons'>
                        <EditActor actor={actor} editActor={editActor} />
                        <Button id="Drop" variant="outlined" color="primary" style={{ margin: 10 }} onClick={() => deleteActor(actor.actorId)}>
                          Delete
                        </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}

export default Actors;
