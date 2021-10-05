

function userReducer(state={},action)
{
    switch(action.type)
    {
        case "LOGIN_START":
           return {user: null,isFetching: true,error: false};
        case "LOGIN_SUCCESS":
           return {user: action.payload,isFetching: false,error: false};
        case "LOGIN_FAILURE":
           return {user: null,isFetching: false,error: action.payload};
        case "USER_LOGOUT" :
          return {user: null,isFetching: false,error:false};
        case "USER_UPDATED":
           return {user:action.payload}
        default:
            return state;
    }
  
}
export {userReducer}