import React from 'react'
import './Hero.css';


import { useState } from 'react';


function Hero() {


    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <div className="hero-content">
    <h1 className="hero-title">Tackling Litter with <h1 className='hero-title2'>TECHNOLOGY</h1></h1>
  </div>
  )
}

export default Hero