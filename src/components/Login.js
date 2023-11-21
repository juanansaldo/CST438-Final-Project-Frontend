import React, {useState} from 'react';
import '../App.css';
import ListMovies from './ListMovies';
import Actors from './Actors';
import SavedMovies from './SavedMovies';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

function Login() {
    const[user, setUser] = useState({username:'', password:'', role:''});
    const[isAuthenticated, setAuth] = useState(false);

    const onChange = (event) => {
        setUser({...user, [event.target.name] : event.target.value});
    }

    const login = () => {
        fetch('http://localhost:8081/login', {
            method:'POST',
            headers: {'Content-Type':'application/json' },
            body: JSON.stringify(user)
        })
        .then(res => { 
            const jwtToken = res.headers.get('Authorization');
            if (jwtToken !== null) {
                sessionStorage.setItem("jwt", jwtToken);
                setAuth(true);
            }
        })
        .catch(err => console.log(err));
    }

    if (isAuthenticated) {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={ListMovies} />
                    <Route path="/actors" component={Actors} />
                    <Route path="/saved-movies" exact component={SavedMovies} /> 
                    {/* other routes */}
                </Switch>
            </Router>
        )
    } else {
        return (
            <div className="Login-page">
                <table>
                    <tbody>
                        <tr><td>
                            <label htmlFor="username">UserName</label>
                        </td><td>
                            <input type="text" name="username" value={user.username} onChange={onChange} />
                        </td></tr>
                        <tr><td>
                            <label htmlFor="password">Password</label>
                        </td><td>
                            <input type="text" name="password" value={user.password} onChange={onChange} />
                        </td></tr>
                        <Button id="submit" variant="outlined" color="primary" onClick={login}>Login</Button>
                    </tbody>
                </table>
            </div>
        );
    }
}
export default Login;
