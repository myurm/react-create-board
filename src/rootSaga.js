import { map } from "ramda";
import { all, fork } from "redux-saga/effects";
import boardSaga from "./sagas/boradSaga";
import articleSaga from "./sagas/articleSaga";
import commentSaga from "./sagas/commentSaga";
import codeSaga from "./sagas/codeSaga";

let combineSagas = {};
combineSagas = Object.assign(combineSagas, { boardSaga, articleSaga, commentSaga, codeSaga }); // saga 하나로 합치는 곳

export default function* rootSaga() {
    yield all(map(fork, combineSagas));
}