import "./messenger.css";
import {  useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import axios from "axios"
import Conversation from "./Conversation";
import {getOnlineConversations} from "../../../actions/conversationActions"
import {searchUser} from "../../../actions/userActions"
import { format } from "timeago.js";

export default function Messenger(props) {

  const [currentChat, setCurrentChat] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);  
  const [searchTerms,setSearchTerms]=("");
  const [destinationUser,setDestinationUser]=useState()
  const [datagetMessage,setDatagetMessage]=useState()
  
  const {user}=useSelector(state=>state.user)
  const conversations=useSelector(state=>state.conversations)
  const dispatch=useDispatch()

    
  const search=async(e)=>{
          if(e.target.value.length===0)
          {
            if( onlineUsers.length >0  ) dispatch(getOnlineConversations(user.token,onlineUsers))
            else dispatch({ type: "LIST_CONVERSATIONS_EMPTY"}); 
          }
          else
            dispatch(searchUser(e.target.value,user.token))    
  }
  
 
  useEffect(()=>{
    let conversationsCopy=[...conversations]
    conversationsCopy?.find(c=>c._id==datagetMessage?.conversationId)?.messages.push(
      {
        sender: datagetMessage?.senderId,
        content: datagetMessage?.text
      })
    dispatch({type:"LIST_CONVERSATIONS",payload:conversationsCopy})  
    setTimeout(() => {
      var container = document.getElementById('conversation-container')
      if(container) container.scrollTop = container?.scrollHeight;
    }, 500);
      
  },[datagetMessage])

  
  useEffect(()=>{
    props.socket.on("getMessage", data =>setDatagetMessage(data))
  },[])
   

  useEffect(()=>{  
    if(user)
    {
    props.socket.emit("addUser", user._id);
    props.socket.on("getUsers", (users) => setOnlineUsers(users.map(user=>user.userId).filter(id=>id!=user._id)))
    }
  },[user])

  useEffect(() => {
      if(destinationUser)
      {
          if(onlineUsers.includes(destinationUser._id))
          {
              let destUser={...destinationUser}
              destUser.connection.status=true 
              destUser.connection.lastVisit=""
              setDestinationUser(destUser)
          }
          else
          {
              let destUserr={...destinationUser}
              destUserr.connection.status=false
              destUserr.connection.lastVisit=new Date().toISOString();
              setDestinationUser(destUserr)
          }
      }
      if( onlineUsers.length >0  )
          dispatch(getOnlineConversations(user.token,onlineUsers))
      else
          dispatch({ type: "LIST_CONVERSATIONS_EMPTY"});   
    },[onlineUsers]);


    const selectConversation=(c)=>{
      setCurrentChat(c)
      const friend = c.users.find((m) => m._id !== user._id);
      setDestinationUser(friend);
      setTimeout(() => {
        var container = document.getElementById('conversation-container')
        if(container)
        container.scrollTop = container?.scrollHeight;
      }, 100);

    }

    const onSendMessage=async()=>{ 
      const message = {
        sender: user._id,
        content: newMessage,
        conversationId: currentChat._id,
      };      
      const receiverId = currentChat.users.find((member) => member._id !== user._id);
  
      props.socket.emit("sendMessage", {
        senderId: user._id,
        receiverId:receiverId._id,
        text: newMessage,
        conversationId: currentChat._id
      });
  
      try 
      {
        const res = await axios.post(`${process.env.REACT_APP_IP}/api/messages`, message);
        let currentConversation={...currentChat}
        currentConversation.messages.push(res.data)
        setCurrentChat(currentConversation)
        setNewMessage("");

        var container = document.getElementById('conversation-container')
        if(container) container.scrollTop = container?.scrollHeight;
      } 
      catch (err) 
      {
        console.log(err);
      }
    }

    
    return (
      user &&
        <section className="chat">
          <div className="container-fluid">
            <div className="row" style={{ backgroundColor: "white" }}>
             <div className="messages-box">
              <div className="row">
              <div className="col-lg-4 col-md-12 no-pdd">
                <div className="messages-container">
                  <div className="message-header">
                    <div className="message-title">
                      <div className="search-area">
                        <div className="input-field">
                          <input
                            placeholder="Search"
                            type="text"
                            value={searchTerms}
                            onChange={(e) => search(e)}
                          />

                          <i className="fa fa-search"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                    <div className="messages-list">
                      <ul style={{ listStyle: "none" }}>
                        {conversations.map((c) => 
                             <li className="message-item" onClick={()=>selectConversation(c)}>
                             <Conversation conversation={c} currentUser={user}/>
                           </li>
                         )}
                      </ul>
                    </div>
                  </div>
                </div>

                  {!currentChat && (
                   <div className="col-lg-8 col-md-12 pd-right-none pd-left-none">
                  <div className="conversation-box">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "85px",
                        marginTop:"150px"
                      }}
                    >
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <i className="fab fa-facebook-messenger" style={{ color: "#0084ff", fontSize: "60px" }}></i>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <h4>
                            Welcome, <strong> {user?.name}</strong>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  )}

                {currentChat && (
                <div className="col-lg-8 col-md-12 pd-right-none pd-left-none">
                  <div className="conversation-box">
                    <div className="conversation-header">
                      <div className="user-message-details">
                        <div className="user-message-img">
                          <div
                            style={{
                               backgroundImage: `url(${destinationUser?.profilePicture})`
                            }}
                            className="img-circle"
                          ></div>
                        </div>
                        <div className="user-message-header">
                          <h4 className="user-name">
                            {`${destinationUser?.name} ${destinationUser?.surname}`}
                          </h4>
                          <div style={{display: "flex",alignItems: "center"}}>
                            {destinationUser?.connection.status && <span className="online-status"></span>}
                                <h5
                                  style={{ margin: "5px",fontWeight: "400px",color: "#999999"}}>
                                  {destinationUser?.connection.status ? "en ligne ":"hors ligne" }
                                </h5>
                                <h5 style={{margin: "10px",fontWeight: "400px",color: "#999999"}}>
                                {format(destinationUser?.connection.lastVisit)}
                                </h5>
                              </div>
                        </div>
                       </div>
                    </div>

                    <div className="conversation-container" id="conversation-container">
                      {currentChat.messages.length == 0 && (
                        <div>
                          <div style={{display: "flex",justifyContent: "center"}}>
                            <span className="time-posted" style={{ color: "#999999" }}>
                              Now
                            </span>
                          </div>
                          <div
                            style={{display: "flex",justifyContent: "center"}}>
                            <div style={{display:"flex"}}>
                              <img
                                src={user.profilePicture}
                                style={{ border: "2px solid white" }}
                                className="image-in-container"
                                alt=""
                              />
                              <img
                                src={destinationUser?.profilePicture}
                                style={{marginLeft: "-11px",border: "2px solid white"}}
                                className="image-in-container"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              color: "#999999",
                              fontSize: "12px",
                            }}
                          >
                            Bienvenue à vous deux sur Messenger.
                          </div>
                        </div>
                      )}

                      {currentChat.messages.length > 0 && (
                        <div style={{position:"relative",minHeight:"30vh"}}>
                          <div>
                            {currentChat.messages.map((message) => 
                               
                                 (message.sender==user._id) ?  
 
                                 (
                                  <div className="convo-box convo-right">
                                  <div className="convo-area-right">
                                     
                                    <div className="convo-message-right">
                                      <div className="convo-message-content" style={{ display:"flex"}}>
                                        <div style={{display: "flex",alignItems: "center",}} >
                                        </div>
                                          <div className="message-text-right">
                                            {message.content.length > 0 && (
                                              <>
                                              <p style={{backgroundColor:"white",color: "#999999"}} >
                                                {message.createdAt.substr(11,5)}</p>
                                              <p
                                                style={{backgroundColor: "rgb(0,132,255)"}}>
                                                {message.content}
                                              </p>
                                              
                                              </>
                                              )}
                                          </div> 
                                      </div>
                                    </div>

                                    <div style={{display: "flex",alignItems: "flex-end"}}>
                                        <img
                                          src={user.profilePicture}
                                          alt=""
                                          className="conversation-user-image"
                                        />
                                    </div>
                                  </div>
                                </div>
                                 ) :
                                 
                                 (
                                    <div className="convo-box convo-left">
                                      <div className="convo-area-left">
                                        
                                       <div style={{display: "flex",alignItems: "flex-end"}}>
                                          <img
                                            src={destinationUser?.profilePicture}
                                            alt=""
                                            className="conversation-user-image"
                                          />
                                        </div>

                                        <div className="convo-message-left">
                                          <div className="convo-message-content" style={{display:"flex"}}>
                                              <div className="message-text-left">
                                                {message.content.length > 0 && (<><p
                                                style={{backgroundColor: "rgb(0,132,255)",color:"white"}} >{message.content}</p>
                                                
                                                <p style={{backgroundColor:"white",color: "#999999"}} >{message.createdAt?.substr(11,5)}</p></>)}
                                              </div>
                                             
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                 ) 
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="type_messages">    
                          <div className="input-field">
                            <textarea
                              minRows="1"
                              placeholder="Type a new message"
                              onChange={(e)=>setNewMessage(e.target.value)}
                              id="currentMessage"
                              value={newMessage}
                            ></textarea>
                            
                            <ul className="emoji">
                              <li>
                                {newMessage.length > 0  && (
                                  <i
                                    className="fas fa-paper-plane send-message-icon"    
                                    onClick={() => onSendMessage()}>
                                    </i>)}
                                </li>
                              </ul>
                          </div>
                      </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
       </div>            
  </section>)

}
