import { all, fork, call, take, put } from "redux-saga/effects";
import { boardActions } from "../slices/boardSlice";
import axiosInstance from "../utils/axios";

// api
    // boardList
    function apiGetBoardList() {
        return axiosInstance.get(`boards`);
    }
    // board
    function apiGetBoard(boardId) {
        return axiosInstance.get(`boards/${boardId}`);
    }
    // post
    function apiPostBoard(requestBody) {
        return axiosInstance.post(`boards`, requestBody);
    }
    // put
    function apiPutBoard(requestBody) {
        return axiosInstance.put(`boards/${requestBody?.id}`, requestBody);
    }
    // delete
    function apiDeleteBoard(boardId) {
        return axiosInstance.delete(`boards/${boardId}`);
    }

// action
    // boardList
    function* asyncGetBoardList() {
        try {
            const rspn = yield call(apiGetBoardList);
            if (rspn?.status === 200) {
                yield put(boardActions.getBoardListSuccess(rspn));
            } else {
                yield put(boardActions.getBoardListFail(rspn));
            }
        } catch(e) {
            yield put(boardActions.getBoardListFail(e.rspn));
        }
    }
    //board
    function* asyncGetBoard(action) {
        try {
            const rspn = yield call(apiGetBoard, action.payload);
            if(rspn?.status === 200) {
                yield put(boardActions.getBoardSuccess(rspn));
            } else {
                yield put(boardActions.getBoardFail(rspn));
            }
        } catch(e) {
            yield put(boardActions.getBoardFail(e.rspn));
        }
    }
    // post
    function* asyncPostBoard(action) {
        try{
            const rspn = yield call(apiPostBoard, {
            ...action.payload.board,
            id: 0,
            insertDate: Date.now(),
            updateDate: Date.now()
            });
            if(rspn?.status === 201) {
                yield put(boardActions.postBoardSuccess());
                alert("등록되었습니다.");
                yield call(action.payload?.setShowCreateBoard, false);
                console.log(action.payload);
                yield put(boardActions.getBoardList()); // list로 이동
            } else {
                yield put(boardActions.postBoardFail(rspn));
            }
        } catch(e) {
            yield put(boardActions.postBoardFail(e.rspn));
            yield alert(`등록 실패 Error: ${e?.rspn.status}, ${e?.rspn?.statusText}`);
        }
    }
    // put
    function* asyncPutBoard(action) {
        try{
            const rspn = yield call(apiPutBoard, {
                ...action.payload,
                updateDate: Date.now()
            });
            if(rspn?.status === 200) {
                yield put(boardActions.putBoardSuccess());
                alert("저장되었습니다.");
                yield put(boardActions.putBoardList()); // list로 이동
            } else {
                yield put(boardActions.putBoardFail(rspn));
            }
        } catch(e) {
            yield put(boardActions.putBoardFail(e.rspn));
            yield alert(`저장 실패 Error: ${e?.rspn?.status}, ${e?.rspn?.statusText}`);
        }
    }
    // delete
    function* asyncDeleteBoard(action) {
        try{
            const rspn = yield call(apiDeleteBoard, action.payload);
            if(rspn?.status === 200) {
                yield put(boardActions.deleteBoardSuccess());
                alert("삭제되었습니다.");
                yield put(boardActions.getBoardList());
            } else {
                yield put(boardActions.deleteBoardFail(rspn));
            }
        } catch(e) {
            yield put(boardActions.deleteBoardFail(e.rspn));
            yield alert(`삭제 실패 Error: ${e?.rspn?.status}, ${e?.rspn?.statusText}`);
        }
    }

// watch 호출
    // boardList
    function* watchGetBoardList() {
        while(true) {
            yield take(boardActions.getBoardList);
            yield call(asyncGetBoardList);
        }
    }
    // board
    function* watchGetBoard() {
        while(true) {
            const actn = yield take(boardActions.getBoard);
            yield call(asyncGetBoard, actn);
        }
    }
    // post
    function* watchPostBoard() {
        while(true) {
            const actn = yield take(boardActions.postBoard);
            yield call(asyncPostBoard, actn);
        }
    }
    // put
    function* watchPutBoard() {
        while(true) {
            const actn = yield take(boardActions.putBoard);
            yield call(asyncPutBoard, actn);
        }
    }
    // delete
    function* watchDeleteBoard() {
        while(true) {
            const actn = yield take(boardActions.deleteBoard);
            yield call(asyncDeleteBoard, actn);
        }
    }


// watch
export default function* boardSaga() {
    yield all([fork(watchGetBoardList)]); // boardList
    yield all([fork(watchGetBoard)]); // board
    yield all([fork(watchPostBoard)]); // post
    yield all([fork(watchPutBoard)]); // put
    yield all([fork(watchDeleteBoard)]); // delete
}