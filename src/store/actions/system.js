import { createRoutine } from "redux-saga-routines";

const ChangeLanguage = createRoutine("CHANGE_LANGUAGE");
const Reset = createRoutine("RESET");

export default {
  ChangeLanguage,
  Reset,
};