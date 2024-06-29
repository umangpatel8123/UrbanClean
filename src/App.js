import logo from './logo.svg';
import './App.css';
import './components/Home.js'
import Home from './components/Home.js';
import Login from './components/Login.js';
import SignUp from './components/SignUp.js';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>


      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
     
     
      
      </Routes>
      </Router>
    </div>
  );
}

export default App;
