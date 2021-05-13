import { all, call, fork, put, take } from "redux-saga/effects";
import { codeActions } from "../slices/codeSlice";
import axiosInstance from "../utils/axios";

// api
    // get List
    function apiGetCodeList() {
        return axiosInstance.get(`/codes`);
    }
    // get
    function apiGetCode(codeId) {
        return axiosInstance.get(`codes/${codeId}`);
    };
    // post
    function apiPostCode(requestBody) {
        return axiosInstance.post(`codes`,requestBody);
    };
    // put
    function apiPutCode(requestBody) {
        return axiosInstance.put(`codes/${requestBody?.id}`, requestBody);
    };
    // delete
    function apiDeleteCode(codeId) {
        return axiosInstance.delete(`codes/${codeId}`);
    };

// action
    // get List
    function* asyncGetCodeList() {
        try {
            const rspn = yield call(apiGetCodeList);
            if(rspn?.status === 200) {
                yield put(codeActions.getCodeListSuccess(rspn));
            } else {
                yield put(codeActions.getCodeListFail(rspn));
            }
        } catch(e) {
            yield put(codeActions.getCodeListFail(e.rspn));
        }
    }
    // get
    function* asyncGetCode(action) {
        try {
            const rspn = yield call(apiGetCode, action.payload);
            if(rspn?.status === 200) {
                yield put(codeActions.getCodeSuccess());
            } else {
                yield put(codeActions.getCodeFail(rspn));
            }
        } catch(e) {
            yield put(codeActions.getCodeFail(e.rspn));
        }
    }
    // post
    function* asyncPostCode(action) {
        try {
            const rspn = yield call(apiPostCode, {
                ...action.payload.code,
                id: 0,
                insertDate: Date.now(),
                updateDate: Date.now()
            });
            if(rspn?.status === 201) {
                yield put(codeActions.postCodeSuccess());
                alert("등록되었습니다.");
                yield call(action.payload?.setShowCreateCode, false);
                console.log(action.payload);
                yield put(codeActions.getCodeList());
            } else {
                yield put(codeActions.postCodeFail(rspn));
            }
        } catch(e) {
            yield put(codeActions.postCodeFail(e.rspn));
        }
    }
    // put
    function* asyncPutCode(action) {
        try {
            const rspn = yield call(apiPutCode, {
                ...action.payload,
                updateDate: Date.now()
            });
            if(rspn?.status === 200) {
                yield put(codeActions.putCodeSuccess());
                alert("저장되었습니다.");
                yield put(codeActions.getCodeList());
            } else {
                yield put(codeActions.putCodeFail(rspn));
            }
        } catch(e) {
            yield put(codeActions.putCodeFail(e.rspn));
        }
    }
    // delete
    function* asyncDeleteCode(action) {
        try {
            const rspn = yield call(apiDeleteCode, action.payload);
            if(rspn?.status === 200) {
                yield put(codeActions.deleteCodeSuccess());
                alert("삭제되었습니다.");
                yield put(codeActions.getCodeList());
            } else {
                yield put(codeActions.deleteCodeFail(rspn));
            }
        } catch(e) {
            yield put(codeActions.deleteCodeFail(e.rspn));
        }
    }

// watch
    // get List
    function* watchGetCodeList() {
        while(true) {
            yield take(codeActions.getCodeList);
            yield call(asyncGetCodeList);
        }
    }
    // get
    function* watchGetCode() {
        while(true) {
            const actn = yield take(codeActions.getCode);
            yield call(asyncGetCode, actn);
        }
    }
    //post
    function* watchPostCode() {
        while(true) {
            const actn = yield take(codeActions.postCode);
            yield call(asyncPostCode, actn);
        }
    }
    // put
    function* watchPutCode() {
        while(true) {
            const actn = yield take(codeActions.putCode);
            yield call(asyncPutCode, actn);
        }
    }
    // delete
    function* watchDeleteCode() {
        while(true) {
            const actn = yield take(codeActions.deleteCode);
            yield call(asyncDeleteCode, actn);
        }
    }

export default function* codeSaga() {
    yield all([fork(watchGetCodeList)]); // get List
    yield all([fork(watchGetCode)]); // get
    yield all([fork(watchPostCode)]); // post
    yield all([fork(watchPutCode)]); // put
    yield all([fork(watchDeleteCode)]); // delete
};