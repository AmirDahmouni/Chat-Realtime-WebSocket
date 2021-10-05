import Swal from 'sweetalert2';
import React, { useState ,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {login} from "../../../actions/userActions"
import "../loginPage/login.css"


const LoginPageComponent= () => {
    const dispatch=useDispatch()
    const history = useHistory();
    const [username,setusername]=useState('')
    const [password,setpassword]=useState('')
    const [showpassword,setShowpassword]=useState(false)
    

    const onConnect =async()=> 
    {
      try{
        dispatch(login({ username,password }));
        history.push("/messenger")
      }
      catch(error) 
      {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error
        })
      }
    }
   
  
    
    return (  
      <div className="limiter">
      <div className="container-login">
        <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">
          <form className="login100-form validate-form flex-sb flex-w" style={{padding:"20px 10px 20px 10px"}}>
            <div className="login100-form-title p-b-32" style={{display:"flex",justifyContent:"center"}}>
              <i className="fab fa-facebook-messenger" style={{fontSize:"75px",color:"#0084ff"}}></i>
            </div>
           
            <div className="wrap-input100 validate-input m-b-36">
              <input className="input100" type="text" placeholder="username" id="username"
               value={username}
               onChange={(e)=> setusername(e.target.value)}
                 />
              <span className="focus-input100"></span>
            </div>
    
            <div className="wrap-input100 validate-input m-b-12">
              <span className=" btn-show-pass" >
                <i className={ showpassword ? "fa fa-eye" :"fa fa-eye-slash"} style={{width:20,height:20}}
                onClick={()=>setShowpassword(!showpassword)}
               ></i>
              </span>
              <input className="input100" type={ showpassword ? "text" : "password"} id="password"
                placeholder="password" value={password} onChange={(e)=>setpassword(e.target.value)} />
              <span className="focus-input100"></span>
            </div>
    
            <div className="flex-sb-m w-full p-b-48">
              <div className="contact100-form-checkbox">
                <input className="input-checkbox100" id="ckb1" type="checkbox" />
                <label className="label-checkbox100" for="ckb1">
                  Remember me
                </label>
              </div>
    
              <div>
                <a href="#" className="txt3">
                  Forgot password?
                </a>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'center',width:"100%"}} >
              <input type="button" className="login100-form-btn loginbtn" onClick={onConnect} value="Login" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPageComponent;