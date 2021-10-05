import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import "./navbar.css";
const Navbar = () => {
  
    return (
    <nav className="navbar">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
      <div style={{width:"100%"}}>
         <NavLink to='/signup' ><h4 style={{cursor:"pointer",outline:"None"}}> Messenger</h4></NavLink>
      </div>
      <div
      style={{width:"100%",display:"flex",justifyContent:"flex-end",alignItems:"center"}}
      >
      <NavLink to='/login' ><button className="login-button" >Login</button></NavLink>
      <NavLink to='/signup'> <button className="singup-button">Sign Up</button></NavLink>
      </div>
    </div>
  </nav>  );
}
 
export default Navbar;    


