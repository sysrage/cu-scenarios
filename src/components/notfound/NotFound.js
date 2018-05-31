import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="NotFound">
      <div className="NotFound-title">Oops! Page not found.</div>
      <Link to="/" className="NotFound-link">Go to homepage.</Link>
    </div>
  );
}

export default NotFound;