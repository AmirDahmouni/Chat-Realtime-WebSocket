import axios from "axios";
import Cookie from 'js-cookie';
export const login=(userCredential)=> async (dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try 
  {
    const {data} = await axios.post(`${process.env.REACT_APP_IP}/api/users/login`,{username:userCredential.username,
                                                     password:userCredential.password});
    Cookie.set('userInfo', JSON.stringify(data));
    dispatch({ type: "LOGIN_SUCCESS", payload: data });
  } 
  catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err.message });
  }
};

export const register=(user)=>async ()=>{

  try{
    await axios.post(`${process.env.REACT_APP_IP}/api/users/register`, user);
  }
  catch(err){
    console.log(err);
  }
}

export const logout=(token)=>async(dispatch)=>{
  try{
    Cookie.remove("userInfo");
    await axios.put(`${process.env.REACT_APP_IP}/api/users/logout`,{},{
      headers: {
        Authorization:  token
      }
    })
    
    dispatch({ type: "USER_LOGOUT" })
    
  }
  catch(err)
  {
    console.log(err.message)
  }  
}

export const updateUserProfileImg=(profileImage,token)=>async(dispatch)=>{
  try
  {
   await axios.put(`${process.env.REACT_APP_IP}/api/users/updateImage`,profileImage, 
                    {headers: {"Content-Type":'multipart/form-data',Authorization: token}})
                    
  }
  catch(err)
  {

  }
}

export const updateUserInfo=(data,token)=>async(dispatch)=>{

  try{
    await axios.put(`${process.env.REACT_APP_IP}/api/users`,data,{headers: {Authorization: token}});
  }
  catch(err)
  {

  }
}

export const searchUser=(key,token)=>async(dispatch)=>{
  try{
    const {data} = await axios.post(`${process.env.REACT_APP_IP}/api/users/search`,
    {keywords:key},{headers: {Authorization: token}});
    dispatch({type:"LIST_CONVERSATIONS",payload:data})
  }
  catch(err)
  {
    
  }
}