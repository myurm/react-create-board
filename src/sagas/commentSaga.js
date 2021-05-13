import { all, call, fork, put, select, take } from "redux-saga/effects";
import { commentActions } from "../slices/commentSlice";
import axiosInstance from "../utils/axios";
import qs from "query-string";

// api
    // get
    function apiGetCommentList(requestParams) {
        return axiosInstance.get(`comments?${qs.stringify(requestParams)}`);
    }
    // insert
    function apiInsertComment(requestBody) {
        return axiosInstance.post(`comments`, requestBody);
    }
    // delete
    function apiDeleteComment(commentId) {
        return axiosInstance.delete(`comments/${commentId}`)
    }

// action
    // get
    function* asyncGetCommentList(action) {
        try {
            const rspn = yield call(apiGetCommentList, { articleId: action.payload });
            if(rspn.status === 200) {
                yield put(commentActions.getCommentListSuccess(rspn));
            } else {
                yield put(commentActions.getCommentListFail(rspn));
            }
        } catch(e) {
            yield put(commentActions.getCommentListFail(e.rspn));
        }
    }
    // insert
    function* asyncInsertComment(action) {
        try {
            const article = yield select((state) => state.articleReducer.article);
            const rspn = yield call(apiInsertComment, {
                // board.json 에 있음
                id: 0, // 댓글 id
                content: action.payload, // 댓글 내용
                boardId: article.boardId, // 게시판 id
                articleId: article.id, // 게시글 id
                insertDate: Date.now(), // 등록 날짜
                updateDate: Date.now() // 수정 날짜
            });
            if(rspn.status === 201) { // network 보면 201이라고 되어있음
                yield put(commentActions.insertCommentSuccess()); // 댓글 입력 성공만 확인
                yield put(commentActions.getCommentList(article.id)); // 댓글 리스트에 추가(article.id)
            } else {
                yield put(commentActions.insertCommentFail(rspn));
            }
        } catch(e) {
            // yield put(commentActions.insertCommentFail(e.rspn));
            if(e?.rspn) {
                yield alert(`등록 실패 Error: ${e?.rspn?.status}, ${e?.rspn?.statusText}`);
                yield put(commentActions.insertCommentFail(e.rspn));
            } else {
                yield put(commentActions.insertCommentFail(e));
            }
        }
    }
    // delete
    function* asyncDeleteComment(action) {
        try {
            const article = yield select((state) => state.articleReducer.article);
            const rspn = yield call(apiDeleteComment, action.payload);
            if(rspn.status === 200) {
                yield put(commentActions.deleteCommentSuccess()); // 댓글 삭제 성공만 확인
                yield put(commentActions.getCommentList(article.id));
            }
        } catch(e) {
            yield put(commentActions.deleteCommentFail(e.rspn));
            yield alert(`삭제 실패 Error: ${e?.rspn?.status}, ${e?.rspn?.statusText}`);
        }
    }

// watch
    // get
    function* watchGetCommentList() {
        while(true) {
            const actn = yield take(commentActions.getCommentList);
            yield call(asyncGetCommentList, actn);
        }
    }
    // insert
    function* watchInsertComment() {
        while(true) {
            const actn = yield take(commentActions.insertComment);
            yield call(asyncInsertComment, actn);
        }
    }
    // delete
    function* watchDeleteComment() {
        while(true) {
            const actn = yield take(commentActions.deleteComment);
            yield call(asyncDeleteComment, actn);
        }
    }

export default function* commentSaga() {
    yield all([fork(watchGetCommentList)]); // get
    yield all([fork(watchInsertComment)]); // insert
    yield all([fork(watchDeleteComment)]); // delete
}