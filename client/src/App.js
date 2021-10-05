import './App.css'
import React ,{ Component,useState,useEffect,useRef }from 'react'
import SignupComponent from "./components/auth/signUp/signup"
import NavBar from "./components/auth/navBar/navbar"
import UserNavbarComponent from "./components/mainpage/user-navbar/user-navbar"
import LoginPageComponent from "../src/components/auth/loginPage/login"
import Messenger from "../src/components/mainpage/messenger/messenger"
import ProfileSettingsComponent from "../src/components/mainpage/settings/profileSettings"
import {logout} from "../src/actions/userActions"
import { Switch,Route, Redirect,BrowserRouter as Router } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { io } from "socket.io-client";


function App() {
  
  const {user}=useSelector(state=>state.user)
  const [socket,setSocket]=useState(io("ws://localhost:5500"))
  const dispatch=useDispatch()

 
  window.onbeforeunload=()=>{
      
    dispatch(logout(user.token))  
    socket.disconnect()
  } 
  
  
  return (
    <Router>
      { user ?  <UserNavbarComponent socket={socket} /> : <NavBar/>  }
      <Switch>
        <Route path="/signup" component={SignupComponent}/>
        <Route path="/login" component={LoginPageComponent}/>
        <Route path="/messenger" render={(props) => ( <Messenger {...props} socket={socket} />)} />
        <Route path="/settings" component={ProfileSettingsComponent}/>
        <Route path="/" component={LoginPageComponent} exact/>
      </Switch>
    </Router>
  );
}

export default App;
