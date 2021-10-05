

export function conversationReducer(state=[],action)
{
    switch(action.type)
    {
        case "LIST_CONVERSATIONS":
           return action.payload;

        case "LIST_CONVERSATIONS_EMPTY":
            return [];
        default:
            return state
    }
  
}

