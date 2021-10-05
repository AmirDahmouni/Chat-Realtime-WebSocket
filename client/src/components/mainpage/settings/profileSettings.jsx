import React, { useState ,useEffect} from 'react';
import moment from 'moment';
import "./settings.css";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {updateUserProfileImg,updateUserInfo} from "../../../actions/userActions"

const ProfileSettingsComponent = () => {
  
  const [editedUsername, seteditedUsername] = useState()
  const [editedName, seteditedName] = useState()
  const [editedSurname, seteditedSurname] = useState()
  const [editedPhone, seteditedPhone] = useState()
  const [editedAddress, seteditedAddress] = useState()
  const [editedOldPassword, seteditedOldPassword] = useState()
  const [editedNewPassword, seteditedNewPassword] = useState()
  const [editedReNewPassword, seteditedReNewPassword] = useState()
  const [profileImageFile,setprofileImageFile]=useState()

  const [userProfileDispo, setuserProfileDispo] = useState(false)
  const [userProfile, setuserProfile] = useState()

  const [showUsernameModal, setshowUsernameModal] = useState(false)
  const [showPhoneModal, setshowPhoneModal] = useState(false)
  const [showAddressModal, setshowAddressModal] = useState(false)
  const [showSurnameModal, setshowSurnameModal] = useState(false)
  const [showNameModal, setshowNameModal] = useState(false)
  const [showPasswordModal, setshowPasswordModal] = useState(false)
  const [editPasswordError, seteditPasswordError] = useState("")
    
  const {user}=useSelector(state=>state.user)
  const dispatch=useDispatch()


    useEffect(() => {
      if(user)
      {
        setuserProfile(user)
        setuserProfileDispo(true)
      } 
      }
    ,[user])

    const uploadFileHandler=(e)=> {
      const file=e.target.files[0]
      try {
          var reader = new FileReader();
          reader.onload = (e) => dispatch({type:"USER_UPDATED",payload:{...userProfile,profilePicture:e.target.result}}) 
          reader.readAsDataURL(file);
          setprofileImageFile(file)
          const fd = new FormData()
          fd.append("profileImage",file)
          dispatch(updateUserProfileImg(fd,user.token))
    
      } 
      catch (err) 
      {
          console.log(err)
      }
    }

    const transformDateJoin=(date)=> {
      const _Date = new Date(date);
      const _nowDate = new Date()
      const nowYear = _nowDate.getFullYear();
      const year = + _Date.getFullYear();

      if (year == nowYear) {
          return moment(new Date(date)).format('DD MMMM')

      }
      return moment(new Date(date)).format('DD MMMM YYYY')
    }

    const onShowUsernameModal = (status) => {
      setshowUsernameModal(status);
    };
    const saveUsername=()=> {
    
      dispatch(updateUserInfo({...user,username:editedUsername},user.token))
      setshowUsernameModal(false);
      dispatch({type:"USER_UPDATED",payload:{...userProfile,username:editedUsername}})
    }
   
    const onShowNameModal=(status)=>{
      setshowNameModal(status)
    }

    const saveName=()=>{
      dispatch(updateUserInfo({...user,name:editedName},user.token))
      setshowNameModal(false);
      dispatch({type:"USER_UPDATED",payload:{...userProfile,name:editedName}})
    }

    const onShowSurnameModal=(status)=>{
      setshowSurnameModal(status)
    }

    const saveSurname=()=>{
      dispatch(updateUserInfo({...user,surname:editedSurname},user.token))
      setshowSurnameModal(false)
      dispatch({type:"USER_UPDATED",payload:{...userProfile,surname:editedSurname}})
    }
   
    const onShowPhoneModal=(status)=>{
      setshowPhoneModal(status)
    }
    const savePhone=()=>{
      dispatch(updateUserInfo({...user,tel:editedPhone},user.token))
      setshowPhoneModal(false)
      dispatch({type:"USER_UPDATED",payload:{...userProfile,tel:editedPhone}})
    } 

    const onShowAddressModal=(status)=>{
      setshowAddressModal(status)
    }
    const saveAddress=()=>{
      dispatch(updateUserInfo({...user,address:editedAddress},user.token))
      setshowAddressModal(false)
      dispatch({type:"USER_UPDATED",payload:{...userProfile,address:editedAddress}})
    }

    const onShowPasswordModal=(status)=>{
      setshowPasswordModal(status)
    }
    const resetErrorMsg=()=>{
      seteditPasswordError("")
    }

    const savePassword=()=>{
      
      if (editedNewPassword == editedReNewPassword) {
        dispatch(updateUserInfo({...user,oldpassword:editedOldPassword,newpassword:editedNewPassword},user.token))
        setshowPasswordModal(false); 
      } 
      else {
        seteditPasswordError ("Passwords didn\'t match")
      }
    }


    return (userProfileDispo && (
      <div>
      {
        (showUsernameModal)&& 
        (
          <React.Fragment>
   <div className="backdrop-container" onClick={()=>onShowUsernameModal(false)} >
   </div>
   <div className="modal-container">
     <div className="modal-title">
       <h4>
         Change username
       </h4>
     </div>
     <div className="modal-content-text">
       <input className="modal-input" placeholder={userProfile.username} value={editedUsername} 
       onChange={e=>seteditedUsername(e.target.value)} />
     </div>
     <div className="modal-footer">
       <div>
         <button className="button-success" onClick={()=>onShowUsernameModal(false)}>Annuler</button>
         <button className="button-danger" onClick={()=>saveUsername()}>Enregister</button>
       </div>
     </div>
   </div>
   </React.Fragment>  
       )
      }


      { (showNameModal) &&(
        <React.Fragment>
        <div className="backdrop-container" onClick={()=>onShowNameModal(false)}>
        </div>
        <div className="modal-container">
          <div className="modal-title">
            <h4>
              Change name
            </h4>
          </div>
          <div className="modal-content-text">
            <input className="modal-input" placeholder={userProfile.name} value={editedName} 
            onChange={(e)=>seteditedName(e.target.value)} />
          </div>
          <div className="modal-footer">
            <div>
              <button className="button-success" onClick={()=>onShowNameModal(false)}>Annuler</button>
              <button className="button-danger" onClick={()=>saveName()}>Enregister</button>
            </div>
          </div>
        </div>
        </React.Fragment>
          )    
      }

      { (showSurnameModal)&&
        <React.Fragment>
        <div className="backdrop-container" onClick={()=>onShowSurnameModal(false)} >
        </div>
        <div className="modal-container">
          <div className="modal-title">
            <h4>
              Change surname
            </h4>
          </div>
          <div className="modal-content-text">
            <input className="modal-input" placeholder={userProfile.surname} value={editedSurname}
            onChange={(e)=>seteditedSurname(e.target.value)}  />
          </div>
          <div className="modal-footer">
            <div>
              <button className="button-success" onClick={()=>onShowSurnameModal(false)}>Annuler</button>
              <button className="button-danger" onClick={()=>saveSurname()}>Enregister</button>
            </div>
          </div>
        </div>
        </React.Fragment>
      }

      { (showPhoneModal) &&
        <React.Fragment>
        <div className="backdrop-container" onClick={()=>onShowPhoneModal(false)}>
        </div>
        <div className="modal-container">
          <div className="modal-title">
            <h4>
              Change phone number
            </h4>
          </div>
          <div className="modal-content-text">
            <input className="modal-input" placeholder={userProfile.tel} value={editedPhone}
            onChange={(e)=>seteditedPhone(e.target.value)}  />
          </div>
          <div className="modal-footer">
            <div>
              <button className="button-success" onClick={()=>onShowPhoneModal(false)} >Annuler</button>
              <button className="button-danger" onClick={()=>savePhone()}>Enregister</button>
            </div>
          </div>
        </div>
        </React.Fragment>
      }
      { (showAddressModal)&&
          <React.Fragment>
    <div className="backdrop-container" onClick={()=>onShowAddressModal(false)} >
    </div>
    <div className="modal-container">
      <div className="modal-title">
        <h4>
          Change address
        </h4>
      </div>
      <div className="modal-content-text">
        <input className="modal-input" placeholder={userProfile.address} value={editedAddress}
        onChange={(e)=>seteditedAddress(e.target.value)} />
      </div>
      <div className="modal-footer">
        <div>
          <button className="button-success" onClick={()=>onShowAddressModal(false)} >Annuler</button>
          <button className="button-danger" onClick={()=>saveAddress()}>Enregister</button>
        </div>
      </div>
    </div>
    </React.Fragment>
      }

      { (showPasswordModal)&&
        <React.Fragment>
        <div className="backdrop-container" onClick={()=>onShowPasswordModal(false)} >
        </div>
        <div className="modal-container">
          <div className="modal-title">
            <h4>
              Change password
            </h4>
          </div>
          <div className="modal-content-text">
            <div>
    
              <input className="modal-input" type="password" placeholder="old Password" value={editedOldPassword} 
              onChange={(e)=>seteditedOldPassword(e.target.value)}
              onFocus={()=>resetErrorMsg()}
                 />
              <input className="modal-input" type="password" placeholder="new password" value={editedNewPassword} 
               onChange={(e)=>seteditedNewPassword(e.target.value)}
                onFocus={()=>resetErrorMsg()} />
              <input className="modal-input" type="password" placeholder="re-enter new password" onFocus={()=>resetErrorMsg()}
              onChange={(e)=>seteditedReNewPassword(e.target.value)}  value={editedReNewPassword} />

              <div style={{display:"flex",paddingTop:"10px",justifyContent:"center",alignItems:"center"}}>
                <h5 style={{fontSize:"14px",fontWeight:"400px",color:"#f03d25"}}
                 >{editPasswordError}</h5>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div>
              <button className="button-success" onClick={()=>onShowPasswordModal(false)}>Annuler</button>
              <button className="button-danger" onClick={()=>savePassword()} >Enregister</button>
            </div>
          </div>
        </div>
        </React.Fragment>
      }

    <div className="col-lg-12 col-md-12">
        <div className="profile-box">
      <div className="profile-info-container">
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} 
        >
          <label htmlFor="uploadImage" >
          <div className="image-container">
            <div className="edit-image-container">
              <i className="far fa-edit edit-image-icon" ></i>
            </div>
            <div className="profile-image"
            style={{ backgroundImage: `url("${userProfile.profilePicture}")`,width:'150px', height:"150px" }}
            >
            </div>
          </div>
          </label>
        </div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",paddingTop:"10px"}}>
          <h4 className="user-name">
            {userProfile.surname} {userProfile.name}
          </h4>
        </div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}
         >
          <h4 className="field-title">
            Member depuis: <span className="field-content">{transformDateJoin(userProfile.joinDate)}</span>
          </h4>
        </div>
        <div style={{marginTop:"20px"}}>
          <div className="field-container">
            <h4 className="field-title">
              Username: <span className="field-content">{userProfile.username}</span>
              <i className="far fa-edit edit-icon" onClick={()=>onShowUsernameModal(true)} ></i>
            </h4>

          </div>
          <div className="field-container">
            <h4 className="field-title">
              name: <span className="field-content">{userProfile.name}</span>
              <i className="far fa-edit edit-icon" onClick={()=>setshowNameModal(true)} ></i>
            </h4>

          </div>
          <div className="field-container">
            <h4 className="field-title">
              Surname: <span className="field-content">{userProfile.surname}</span>
              <i className="far fa-edit edit-icon" onClick={()=>onShowSurnameModal(true)} ></i>
            </h4>
          </div>
          <div className="field-container">
            <h4 className="field-title">
              Password: <span className="field-content">*********</span>
              <i className="far fa-edit edit-icon" onClick={()=>onShowPasswordModal(true)} ></i>
            </h4>
          </div>
          <div className="field-container">
            <h4 className="field-title">
              Phone: <span className="field-content">{userProfile.tel}</span>
              <i className="far fa-edit edit-icon" onClick={()=>onShowPhoneModal(true)} ></i>
            </h4>

          </div>
          <div className="field-container">
            <h4 className="field-title">
              Address: <span className="field-content">{userProfile.address}</span>
              <i className="far fa-edit edit-icon" onClick={()=>onShowAddressModal(true)} ></i>
            </h4>

          </div>
        </div>
      </div>
      <input type="file" id="uploadImage" style={{display:"none"}} onChange={uploadFileHandler} />
      </div>
    </div>     
  </div>)
  )
         
}
 
export default ProfileSettingsComponent;