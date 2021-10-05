
import axios from "axios";
import { useEffect, useState } from "react";
import { format } from "timeago.js";


export default function Conversation({ conversation, currentUser }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
      const friendId = conversation.users.find((m) => m._id !== currentUser._id);
      const getUser = async () => {
        try {
          const {data} = await axios.get(`${process.env.REACT_APP_IP}/api/users?userId=${friendId._id}`);
          
          setUser(data);
        } catch (err) {
          console.log(err);
        }
      };
      getUser();
    }, [currentUser, conversation]);

    return conversation && user && (
                      <div className="user-message-details">
                               <div className="user-message-img">
                                    {user.connection.status && <span className="online-status on-picture"></span> } 
                                 <div
                                   style={{ backgroundImage: `url(${user.profilePicture})`  }}
                                   className="img-circle"
                                 ></div>
                               </div>
                               <div className="user-message-info">
                                 <div style={{ alignSelf: "center" }}>
                                   <div className="user-display">
                                     <h4 className={"read-userinfo"}>
                                     {user.username}
                                     </h4>
                                   </div>
                                   <div
                                     style={{display: "flex",alignItems: "center"}}>
                                   </div>

                                   <p className="message-field-read" style={{marginTop:"10px"}}>
                                       {conversation.messages.length !== 0 && conversation.messages[conversation.messages.length-1].content}
                                       <span className="message-time">
                                       {conversation.messages.length !== 0 && format(conversation.messages[conversation.messages.length-1].createdAt)}
                                       </span>
                                    </p>

                                   {conversation.messages.length == 0 && (
                                     <p className="message-field-read" style={{marginTop:"10px"}}>
                                       say hello to{" "} {user.username}
                                       <span className="message-time">
                                         Now
                                       </span>
                                     </p>
                                   )}
                                 </div>
                               </div>
                             </div>
    )

}