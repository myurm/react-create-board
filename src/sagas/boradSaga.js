import { all, fork, call, take, put } from "redux-saga/effects";
import { boardActions } from "../slices/boardSlice";
import axiosInstance from "../utils/axios";

// api
function apiGetBoardList() {
    return axiosInstance.get(`boards`);
}

// action
function* asyncGetBoardList() {
    try {
        const rspn = yield call(apiGetBoardList);
        console.table(rspn);
        if (rspn?.status === 200) {
            yield put(boardActions.getBoardListSuccess(rspn));
        } else {
            yield put(boardActions.getBoardListFail(rspn));
        }
    } catch(e) {
        yield put(boardActions.getBoardListFail(e.rspn));
    }
}

// watch 호출
function* watchGetBoardList() {
    while(true) {
        yield take(boardActions.getBoardList);
        yield call(asyncGetBoardList);
    }
}

// watch
export default function* boardSaga() {
    yield all([fork(watchGetBoardList)]);
}