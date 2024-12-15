import React from 'react';
const Navbar = () => {
    return (
      <nav className="navbar">
        <a href="/" className="navbar-logo">Culinary Recipes</a>
        <ul className="navbar-links">
          <li className="navbar-item">
            <a href="/" className="navbar-link">Home</a>
          </li>
          <li className="navbar-item">
            <a href="/recipes" className="navbar-link">Recipes</a>
          </li>
          <li className="navbar-item">
            <a href="/contact" className="navbar-link">Contact Me</a>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default Navbar;
  