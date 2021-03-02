import { takeEvery, call, put, all } from "redux-saga/effects";

import { api, queryBuilder } from "services";

import filemanagerActions from "../actions/filemanager";

function* UploadFile(action) {

	const { files, cb } = action.payload;

	try {
		yield put(filemanagerActions.UploadFile.request());

		const { data } = yield call(api.request.post, queryBuilder('/filemanager/uploads'), files);

		yield put(filemanagerActions.UploadFile.success({ files: data }));
		yield call(cb.success, data);

	} catch (e) {

		yield put(filemanagerActions.UploadFile.failure(e));
		yield call(cb.failure, e);

	} finally {

		yield put(filemanagerActions.UploadFile.fulfill());
		yield call(cb.finally);
	}
}

function* DeleteFile(action) {

	const { fileId } = action.payload;

	try {

		yield put(filemanagerActions.DeleteFile.request());

		yield call(api.request.delete, queryBuilder(`/filemanager/${fileId}`));

	} catch (e) {

		yield put(filemanagerActions.DeleteFile.failure(e));

	} finally {

		yield put(filemanagerActions.DeleteFile.fulfill());
	}
}

export default function* root() {
	yield all([
		takeEvery(filemanagerActions.UploadFile.TRIGGER, UploadFile),
		takeEvery(filemanagerActions.DeleteFile.TRIGGER, DeleteFile)
	]);
}
