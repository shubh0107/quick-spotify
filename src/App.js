
import './tailwind.output.css';

import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <div className="antialiased">
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
    </div>
  )
}

export default App;
