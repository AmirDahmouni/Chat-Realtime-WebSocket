import axios from "axios";


export const getOnlineConversations=(token,onlineUsers)=> async (dispatch) => {
    try {
        const {data} = await axios.get(`${process.env.REACT_APP_IP}/api/users/conversations/`,
        {
          headers: {
            Authorization:  token
          }
        }
        );
        let conversations=data.filter( conversation=>
          conversation.users.some(user=>onlineUsers.includes(user._id)))
        
        dispatch({ type: "LIST_CONVERSATIONS", payload:conversations});
        
      } catch (err) {
        console.log(err);
      }
};