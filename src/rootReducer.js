import { combineReducers } from "redux";
import { articleReducer } from "./slices/articleSlice";
import { boardReducer } from "./slices/boardSlice";
import { commentReducer } from "./slices/commentSlice";

const rootReducer = combineReducers({ articleReducer, boardReducer, commentReducer }); // reducer 합치는 곳

export default rootReducer;