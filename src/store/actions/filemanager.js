import { createRoutine } from "redux-saga-routines";

const UploadFile = createRoutine("UPLOAD_FILE");

const DeleteFile = createRoutine("DELETE_FILE");


export default {
	UploadFile,
	DeleteFile
};
