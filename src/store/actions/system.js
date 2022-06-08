import { createRoutine } from "redux-saga-routines";

const ChangeLanguage = createRoutine("CHANGE_LANGUAGE");
const Reset = createRoutine("RESET");
const SetWindowWidth = createRoutine("SET_WINDOW_WIDTH");

export default {
  ChangeLanguage,
  Reset,
  SetWindowWidth
};