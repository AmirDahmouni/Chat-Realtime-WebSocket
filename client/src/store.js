
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Cookie from 'js-cookie';
import {userReducer} from "./reducers/userReducers"
import {conversationReducer} from "./reducers/conversationReducers"

const userInfo = Cookie.getJSON('userInfo') || null;

const initialState = {
    user:{
        user:userInfo,
        isFetching: false, 
        error: false,
    },
   

    conversations:[]
};
const reducer = combineReducers({
    conversations:conversationReducer,
    user:userReducer
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer,initialState,composeEnhancer(applyMiddleware(thunk)));

export default store;
