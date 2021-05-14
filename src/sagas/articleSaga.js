import { all, call, fork, getContext, put, retry, select, take } from "redux-saga/effects";
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
    // article views & put
    function apiPutArticle(requestBody) {
        return axiosInstance.put(`articles/${requestBody?.id}`, requestBody);
        // requestBody : 요청본문 (반대는 responseBody : 응답본문)
    }
    // post
    function apiPostArticle(requestBody) {
        return axiosInstance.post(`articles/`, requestBody);
    }
    // delete
    function apiDeleteArticle(articleId) {
        return axiosInstance.delete(`articles/${articleId}`);
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
            const rspn = yield call(apiPutArticle, {
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
    // post
    function* asyncPostArticle(action) {
        try {
            const history = yield getContext("history");
            /* store.js에 sagaMiddleware에 context: { history: history } 추가했었음
            react-router-dom의 browserRouter에서는 안 됨 */
            const rspn = yield call(apiPostArticle, {
                ...action.payload,
                id: 0,
                views: 0,
                insertDate: Date.now(),
                updateDate: Date.now()
            });
            if(rspn?.status === 201) {
                yield put(articleActions.postArticleSuccess());
                history.push(`article/${rspn?.data?.id ?? 0}`);
            } else {
                yield put(articleActions.postArticleFail(rspn));
                yield alert(`등록실패 \n Error:${rspn.status}, ${rspn.statusText}`);
            }
        } catch(e) {
            yield put(articleActions.postArticleFail(e.rspn));
            yield alert(`등록실패 \n Error:${e?.rspn?.status}, ${e?.rspn?.statusText}`);
        }
    }
    // modify
    function* asyncSetArticle(action) {
        const history = yield getContext("history");
        try {
            const rspn = yield call(apiGetArticle, action.payload?.articleId)
            console.table(action.payload);
            if(rspn?.status === 200) {
                yield call(action.payload?.setArticle, rspn?.data ?? {});
                // action.payload?.setArticle은 useState의 setArticle임
                // rspn?.data ?? {} 는 apiGetArticle(조회) 값의 data를 갖고 오는 거고, 없으면 빈값 {} 를 갖고 옴
            } else {
                yield alert(`불러오기 실패 Error : ${rspn.status}, ${rspn.statusText}`);
                history.goBack(); //뒤로가기
            }
        } catch(e) {
            yield alert(`불러오기 실패 Error : ${e?.rspn.status}, ${e?.rspn.statusText}`);
            history.goBack(); //뒤로가기
        }
    }
    // put
    function* asyncPutArticle(action) {
        const history = yield getContext("history");
        try {
            const rspn = yield call(apiPutArticle,{
                ...action.payload,
                updateDate: Date.now()
            });
            if(rspn?.status === 200) {
                yield put(articleActions.putArticleSuccess());
                history.push(`/article/${rspn?.data?.id ?? 0}`);
            } else {
                yield put(articleActions.putArticleFail(rspn));
                yield alert(`수정실패 \n Error : ${rspn.status}, ${rspn.statusText}`);
            }
        } catch(e) {
            yield put(articleActions.putArticleFail(e.rspn));
            yield alert(`수정실패 \n Error : ${e.rspn.status}, ${e.rspn.statusText}`);
        }
    }
    // delete
    function* asyncDeleteArticle() {
        const history = yield getContext("history");
        try{
            const article = yield select((state) => state.articleReducer.article);
            const rspn = yield call(apiDeleteArticle, article?.id ?? 0);
            if(rspn.status === 200) {
                yield put(articleActions.deleteArticleSuccess());
                alert("삭제되었습니다.");
                history.push(`/board/${article?.boardId ?? 0}`);
            } else {
                yield put(articleActions.deleteArticleFail(rspn));
            }
        } catch(e) {
            yield put(articleActions.deleteArticleFail(e?.rspn));
            yield alert(`삭제실패 \n Error : ${e?.rspn?.status}, ${e?.rspn?.statusText}`);
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
    // post
    function* watchPostArticle() {
        while(true) {
            const actn = yield take(articleActions.postArticle);
            yield call(asyncPostArticle, actn);
        }
    }
    // modify
    function* watchSetArticle() {
        while(true) {
            const actn = yield take(articleActions.setArticle);
            yield call(asyncSetArticle, actn);
        }
    }
    // put
    function* watchPutArticle() {
        while(true) {
            const actn = yield take(articleActions.putArticle);
            yield call(asyncPutArticle, actn);
        }
    }
    // delete
    function* watchDeleteArticle() {
        while(true) {
            yield take(articleActions.deleteArticle);
            yield call(asyncDeleteArticle);
        }
    }

// watch
export default function* articleSaga() {
    yield all([fork(watchGetArticleList)]); // articleList
    yield all([fork(watchGetArticle)]); // article
    yield all([fork(watchUpdateArticleViews)]); // updateArticleViews
    yield all([fork(watchPostArticle)]); // post
    yield all([fork(watchSetArticle)]); // modify
    yield all([fork(watchPutArticle)]); // put
    yield all([fork(watchDeleteArticle)]); // delete
}