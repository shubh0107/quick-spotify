
import './tailwind.output.css';

import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { SpotifyProvider } from './spotifyContext';

function App() {
  return (
    <div className="antialiased">
      <SpotifyProvider>
        <Router hashType="noslash">
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route>
              {/* <Redirect to="/login" /> */}
              <Login />
            </Route>
            {/* <Route exact path="*">
            <Redirect to="/login" />
          </Route> */}
          </Switch>
        </Router>
      </SpotifyProvider>
    </div>
  )
}

export default App;