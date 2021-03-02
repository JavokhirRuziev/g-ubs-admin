import { takeLatest, put, all } from "redux-saga/effects";

import { storage } from "services";
import systemActions from "../actions/system";

function* ChangeLanguage(action) {
  storage.set("language", action.payload);
  yield put(systemActions.ChangeLanguage.success());
}

export default function* root() {
  yield all([
    takeLatest(systemActions.ChangeLanguage.TRIGGER, ChangeLanguage)
  ]);
}
