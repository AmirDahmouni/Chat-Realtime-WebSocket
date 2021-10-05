import React, { Component,useState,useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { logout } from '../../../actions/userActions';
import "./user-navbar.css"
const UserNavbarComponent = (props) => {

    
    const dispatch=useDispatch()
    const {user}=useSelector(state=>state.user)
    
   

    const onDisconnect=()=> {
        dispatch(logout(user.token))
        props.socket.disconnect()
        window.location="/login"
    }

    return ( 
        
            (user) && (
              <React.Fragment>
                <nav className="navbar">
                <div style={{  display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}} 
                >
                  <div style={{width:"100%"}} >
                  <NavLink to='/messenger'><h4 style={{cursor:"pointer",outline:"none"}}>Messenger</h4></NavLink>
                  </div>
                  <div style={{width:"100%",display:"flex",justifyContent:"flex-end",alignItems:"center"}} >
                    <div className="dropdown">
                      <div style={{display:"flex",alignItems:"center",cursor:"pointer"}}
                        id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true">
                        <div style={{ backgroundImage: `url("${user.profilePicture}")` }} 
                                className="profile-image">
                        </div>
                        <h4 style={{margin:"0",padding:"10px"}}>
                          {user.name} {user.surname}
                        </h4>
                      </div>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <NavLink to='/settings'><button className="dropdown-item">Settings</button></NavLink>
                        <button className="dropdown-item" onClick={onDisconnect}>Disconnect</button>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
              </React.Fragment>
              
            )
     );
}

export default UserNavbarComponent;