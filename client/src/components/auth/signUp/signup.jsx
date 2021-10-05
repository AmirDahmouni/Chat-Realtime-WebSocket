
import React, { Component,useState } from 'react';
import Swal from 'sweetalert2'
import defaultUser from "../../../assets/images/default-user.jpeg"
import "./signup.css"

import { useDispatch } from 'react-redux';
import {register} from "../../../actions/userActions"
const SignupComponent = () => {
  
    const dispatch=useDispatch()
    const [imagePreview,setimagePreview]=useState(defaultUser); 
    const [username,setusername]=useState("");
    const [name,setname]=useState("");
    const [surname, setsurname] = useState("");
    const [password,setpassword]=useState("");
    const [repassword,setrepassword]=useState("");
    const [address,setreadress]=useState("");
    const [phone,setphone]=useState("");
    const [showPassword,setshowPassword]=useState(false);
    const [showRePassword,setshowRePassword]=useState(false);
    const [profileImageFile,setprofileImageFile]=useState();
  
    const registerUser=async()=>{
        if (username.length == 0 || password.length == 0 || name.length == 0 ||
             surname.length == 0 || repassword.length == 0 || profileImageFile==null ) 
        {
            return Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Some fields are required'
            })
        }
        if (password !==repassword) 
        {
            return Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords did\'t match'
            })
        }
        const fd = new FormData()
        fd.append('profileImage', profileImageFile)
        fd.append('username', username)
        fd.append('password', password)
        fd.append('name', name)
        fd.append('surname', surname)
        fd.append('address', address)
        fd.append('phone', phone)
        try{
          console.log(fd)
          dispatch(register(fd))
          
          Swal.fire({
            icon: 'success',
            title: 'Your account is created',
            showConfirmButton: false,
          })
        }
        catch(error)
        {
          if (error.status == 409)
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message
          })
          else {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!'
          })
          }
        }
    }
    const uploadFileHandler=(e)=> {
      
        const file=e.target.files[0]
        try {
            var reader = new FileReader();
            reader.onload = (e) => {setimagePreview(e.target.result);}
            reader.readAsDataURL(file);
            setprofileImageFile (file)
        } catch (err) {
            console.log(err)
        }
    }


    return (
    <div className="limiter">
    <div className="container-login">
      <span className="login100-form-title p-b-32">
        Create an account
      </span>
      <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">
        <form className="login100-form validate-form flex-sb flex-w">
        <div className="wrap-input100 validate-input m-b-36" style={{border:"1px"}}>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <label htmlFor="uploadImage">
            <div className="image-container">
              <div className="edit-image-container">
                <label className="far fa-edit edit-image-icon" ></label>
              </div>
              <div style={{backgroundImage:`url("${imagePreview}")`,width:'150px', height:"150px"}} className="img-circle">
              </div>
            </div>
            </label>
          </div>
          
        </div>
          <span className="txt1 p-b-11">
            Username <span style={{fontWeight:800,fontSize:"18px"}}>*</span>
          </span>
          <div className="wrap-input100 validate-input m-b-36">
            <input className="input100" type="text" name="username" id="username" value={username}
             onChange={(e)=>setusername(e.target.value)} />
            <span className="focus-input100"></span>
          </div>
          <span className="txt1 p-b-11">
            Name <span style={{fontWeight:800, fontSize:"18px"}} >*</span>
          </span>
          <div className="wrap-input100 validate-input m-b-36">
            <input className="input100" type="text" name="name" id="name" value={name} onChange={(e)=>setname(e.target.value)} />
            <span className="focus-input100"></span>
          </div>
          <span className="txt1 p-b-11">Surname <span style={{fontWeight:800, fontSize:"18px"}}>*</span>
          </span>
          <div className="wrap-input100 validate-input m-b-36">
            <input className="input100" type="text" name="surname" id="surname" value={surname}
             onChange={(e)=>setsurname(e.target.value)} />
            <span className="focus-input100"></span>
          </div>
  
          <span className="txt1 p-b-11">
            Enter password <span style={{fontWeight:800, fontSize:"18px"}}>*</span>
          </span>
          <div className="wrap-input100 validate-input m-b-12">
            <span className="btn-show-pass">
              <i className={showPassword ? "fa fa-eye" :"fa fa-eye-slash"}  onClick={()=>setshowPassword(!showPassword)}  ></i>
            </span>
            <input id="password" className="input100" type={showPassword ? 'text' : 'password'} name="password"
              value={password} onChange={(e)=>setpassword(e.target.value)} />
            <span className="focus-input100"></span>
          </div>
          <span className="txt1 p-b-11">
            Reenter password <span style={{fontWeight:"800",fontSize:"18px"}}>*</span>
          </span>
          <div className="wrap-input100 validate-input m-b-36">
            <span className="btn-show-pass">
              <i className={showRePassword ? "fa fa-eye" :"fa fa-eye-slash"}  onClick={()=>setshowRePassword(!showRePassword)}></i>
            </span>
            <input className="input100" type={showRePassword ? 'text' : 'password'} name="repassword" id="repassword"
              value={repassword} onChange={(e)=>setrepassword(e.target.value)} />
            <span className="focus-input100"></span>
          </div>
          <span className="txt1 p-b-11">
            Phone Number
          </span>
          <div className="wrap-input100 validate-input m-b-36">
            <input className="input100" type="text" name="phone" id="phone" value={phone} onChange={(e)=>setphone(e.target.value)} />
            <span className="focus-input100"></span>
          </div>
          <span className="txt1 p-b-11">
            Address
          </span>
          <div className="wrap-input100 validate-input m-b-36">
            <input className="input100" type="text" name="address" id="address" value={address} onChange={(e)=>setreadress(e.target.value)}/>
            <span className="focus-input100"></span>
          </div>
          <div style={{display:"flex",justifyContent:"center",width:"100%"}} >
            <button className="login100-form-btn loginbtn" onClick={registerUser} >
              Register
            </button>
          </div>
        </form>
      </div>
      <input type="file" id="uploadImage" style={{display:"none"}} onChange={uploadFileHandler}  />
    </div>
    
    </div>);
}
    

export default SignupComponent;