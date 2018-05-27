import React from 'react';
import { Link } from 'react-router-dom';
// import Search from './Search';
import logo from './logo.png';
import './Header.css';

const Header = () => {
  return (
    <div className="Header">
      <Link to="/">
        <img src={logo} alt="logo" className="Header-logo" />
      </Link>
      <div className="Header-title">Server Status</div>
    </div>
  );
}

export default Header;