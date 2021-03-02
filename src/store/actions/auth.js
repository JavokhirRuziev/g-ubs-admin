import { createRoutine } from "redux-saga-routines";

const Login = createRoutine("LOGIN");
const Logout = createRoutine("LOGOUT");
const GetMe = createRoutine("GET_ME");

export default {
  Login,
  Logout,
  GetMe,
};