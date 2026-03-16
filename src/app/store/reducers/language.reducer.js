import { LANGUAGE_SET } from "../actions/language.action";
import { getStoredLanguage } from "app/i18n/languageStorage";

const initialState = {
  language: getStoredLanguage(),
};

export default function languageReducer(state = initialState, action) {
  switch (action.type) {
    case LANGUAGE_SET:
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
}

