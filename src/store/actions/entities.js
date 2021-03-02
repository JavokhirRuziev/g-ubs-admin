import { createRoutine } from "redux-saga-routines";

const Load = createRoutine("LOAD_ENTITIES");
const Update = createRoutine("UPDATE_ENTITIES");

export default {
	Load,
	Update
};