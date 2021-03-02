import config from "config";
import systemActions from "../actions/system";

const initialState = {
  currentLangCode: config.DEFAULT_LANGUAGE,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case systemActions.ChangeLanguage.TRIGGER: {
      return { ...state, currentLangCode: action.payload };
    }

    default:
      return state;
  }
};
