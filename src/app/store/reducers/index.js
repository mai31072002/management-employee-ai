import auth from "app/auth/store/reducers";
import appReducer from "./app.reducrs";
import languageReducer from "./language.reducer";
import { combineReducers } from "redux";

const createReducer = (asyncReducers) =>
  combineReducers({
    auth,
    appReducer,
    language: languageReducer,
    ...asyncReducers,
  });

export default createReducer;
