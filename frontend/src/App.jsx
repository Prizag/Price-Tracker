import Dashboard from './components/Dashboard';
import Signin from './components/Signin.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home';
import Tracker from './components/Tracker';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Itempage from './components/Itempage';
function App() {

  return (
    <Router>
      <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Home />} />
            <Route path='/tracker' element={<Tracker/>} />
            <Route path="/item/:id" element={<Itempage/>} />
        </Routes>
    </Router>
  )
}

export default App