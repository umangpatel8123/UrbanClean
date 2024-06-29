import React from 'react'
import './Home.css';
import Hero from './Hero';

import { Link } from 'react-router-dom';

import { useState } from 'react';


function Home() {


    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (

   <>
  
    <div className='Bg'>
    <nav className="navbar">
    <div className="navbar-container">
      <a href="#" className="navbar-logo">
        <img src="/images/logo.png" alt="Logo" />
      </a>
      <div className="navbar-toggle" onClick={toggleMobileMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <li className="navbar-item"><a href="#" className="navbar-link">Home</a></li>
        <li className="navbar-item"><a href="#" className="navbar-link">About</a></li>
        <li className="navbar-item"><a href="#" className="navbar-link">Services</a></li>
        <li className="navbar-item"><Link to="/login" className="rounded-button">Login</Link></li>
        </ul>
    </div>
  
  </nav>
  
  <Hero/>
  </div>
  </>
  
  )
}

export default Home