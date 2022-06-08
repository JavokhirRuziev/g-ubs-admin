import config from "config";
import systemActions from "../actions/system";

const initialState = {
  currentLangCode: config.DEFAULT_LANGUAGE,
  width: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case systemActions.ChangeLanguage.TRIGGER: {
      return { ...state, currentLangCode: action.payload };
    }
    case systemActions.SetWindowWidth.REQUEST: {
      return { ...state, width: action.payload };
    }

    default:
      return state;
  }
};
