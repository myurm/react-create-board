import { all, call, fork, put, retry, take } from "redux-saga/effects";
import { articleActions } from "../slices/articleSlice";
import axiosInstance from "../utils/axios";
import qs from "query-string";

const SECOND = 1000; // retry에서 10 * 1000 이 10초임

// api
    // articleList
    function apiGetArticleList(requestParams) {
        return axiosInstance.get(`articles?${qs.stringify(requestParams)}`);
        // qs.stringify : json 객체를 URL의 매개 변수 문자열로 변환함
        // params가 {boardId: 숫자}이고, query-string으로 바꿔줌 그래서 articles?boardId=숫자가 됨
    }
    // article
    function apiGetArticle(articleId) {
        return axiosInstance.get(`articles/${articleId}`);
    }
    // article views
    function apiUpdateArticleViews(requestBody) {
        console.log(requestBody);
        return axiosInstance.put(`articles/${requestBody?.id}`, requestBody);
        // requestBody : 요청본문 (반대는 responseBody : 응답본문)
    }

// action
    // articleList
    function* asyncGetArticleList(action) {
        try {
            // const rspn = yield call(apiGetArticleList, {boardId: action.payload} ← 얘와 ↓ 얘와 같음); 
            const rspn = yield retry(3, 10 * SECOND, apiGetArticleList, {boardId: action.payload});
            // retry : 네트워크 요청 재시도에는 적합하지 않은데 네트워크 요청을 재시도
            // retry(시도횟수, 시간, 호출 함수, 호출함수input)
            if (rspn?.status === 200) {
                yield put(articleActions.getArticleListSuccess(rspn));
            } else {
                yield put(articleActions.getArticleListFail(rspn));
            }
        } catch(e) {
            yield put(articleActions.getArticleListFail(e.rspn));
        }
    }
    // article
    function* asyncGetArticle(action) {
        try {
            const rspn = yield call(apiGetArticle, action.payload);
            if (rspn?.status === 200) {
                yield put(articleActions.getArticleSuccess()) // 조회 성공 확인만 함
                yield put(articleActions.updateArticleViews(rspn.data)); // 조회수
            } else {
                yield put(articleActions.getArtcileFail(rspn));
            }
        } catch(e) {
            yield put(articleActions.getArticleFail(e.rspn));
        }
    }
    // article Veiws
    function* asyncUpdateArticleViews(action) {
        try {
            const rspn = yield call(apiUpdateArticleViews, {
                ...action.payload,
                // payload에 아래 요소들 추가
                views: parseInt(action.payload?.views ?? 0) + 1, // 조회수 추가
                updateDate: Date.now() // 수정날짜 추가
            });
            if (rspn?.status === 200) {
                yield put(articleActions.updateArticleViewsSuccess(rspn));
            } else {
                yield put(articleActions.updateArticleVeiwsFail(rspn));
            }
        } catch(e) {
            yield put(articleActions.updateArticleVeiwsFail(e.rspn));
        }
    }

// watch 호출
    // articleList
    function* watchGetArticleList() {
        while(true) { 
            const actn = yield take(articleActions.getArticleList);
            yield call(asyncGetArticleList, actn);
        }
    }
    // article
    function* watchGetArticle() {
        while(true) {
            const actn = yield take(articleActions.getArticle);
            yield call(asyncGetArticle, actn);
        }
    }
    // article views
    function* watchUpdateArticleViews() {
        while(true) {
            const actn = yield take(articleActions.updateArticleViews);
            yield call(asyncUpdateArticleViews, actn);
        }
    }

// watch
export default function* articleSaga() {
    yield all([fork(watchGetArticleList)]); // articleList
    yield all([fork(watchGetArticle)]); // article
    yield all([fork(watchUpdateArticleViews)]); // updateArticleViews
}