import React from 'react';
import { Link } from 'react-router-dom';
import { HOME } from '../../routes';
import Logo from '../images/quest-pi-transparent-vector.png';

const LandingPage = () => (
  <div className="container landing-container">
    <Link to={{ pathname: HOME }}>
      <img
        className="landing-logo square fade-in" alt="logo"
        src={Logo}
      />
      <p className="title">Quest-Pi.Co</p>
    </Link>
  </div>
);

export default LandingPage;
