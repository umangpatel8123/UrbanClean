import React, { useState } from 'react';
import './SignUp.css'; // Assuming you create a CSS file for the styles
import { Link } from 'react-router-dom';

function Signup() {
  const [userType, setUserType] = useState('');
  const [location, setLocation] = useState({ lat: '', lon: '' });

  const handleUserTypeChange = (type) => {
    setUserType(type);
    if (type === 'garbageCollector') {
      getGeolocation();
    } else {
      setLocation({ lat: '', lon: '' }); // Clear location if user type is not garbage collector
    }
  };

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  return (
    <div className='Bg2'>
      <div className="container">
        <div className="wrapper">
          <div className="title"><span>Signup Form</span></div>
          <form action="#">
            <div className="row">
              <input type="text" placeholder="Name" required />
            </div>
            <div className="row">
              <input type="text" placeholder="Email" required />
            </div>
            <div className="row">
              <input type="password" placeholder="Password" required />
            </div>
            <div className="row">
              <div className="user-type-buttons">
                <button type="button" className={userType === 'resident' ? 'active' : ''} onClick={() => handleUserTypeChange('resident')}>Resident</button>
                <button type="button" className={userType === 'garbageCollector' ? 'active' : ''} onClick={() => handleUserTypeChange('garbageCollector')}>Garbage Collector</button>
              </div>
            </div>
            {userType === 'garbageCollector' && (
              <div className="row">
                <p>Geolocation: {location.lat ? `Latitude: ${location.lat}, Longitude: ${location.lon}` : 'Fetching location...'}</p>
              </div>
            )}
            <div className="row button">
              <input type="submit" value="Signup" />
            </div>
            <div className="signup-link">Already a member? <a href="#"><Link to="/login" >Login now</Link></a></div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
