
import './tailwind.output.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/home">
        <Home />
      </Route>
    </Router>
  )
}

export default App;
