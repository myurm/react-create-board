import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { articleActions } from "./../slices/articleSlice";
import Comment from "./Comment";
import { useHistory } from 'react-router-dom';
import "./css/Article.css";

function Article() {
    const dispatch = useDispatch();
    const params = useParams();
    const history = useHistory();

    // state
    const article = useSelector((state) => state.articleReducer.article);
    const status = useSelector((state) => state.articleReducer.status);
    const statusText = useSelector((state) => state.articleReducer.statusText);
    const boardList = useSelector((state) => state.boardReducer.boardList);

    console.log(article);

    // event
    function onClickUpdateButton() {
        history.push(`/update/${params?.articleId ?? 0}`);
    }

    function onClickDeleteButton() {
        if(!window.confirm("삭제하시겠습니까?")) {
            return false;
        }
        dispatch(articleActions.deleteArticle());
    }

    // useEffect
    useEffect(() => {
        dispatch(articleActions.getArticle(params?.articleId ?? 0)); // dispatch(파일actions.action(payload));
    }, [dispatch, params?.articleId])

    return (
        <div className="articleWrap">
            {
                status === 200 ?
                <>
                    <div className="boardName">
                        <span>
                            {
                                boardList.length > 0 &&
                                boardList.find((board) => board.id === parseInt(article?.boardId))?.name
                            }
                            {/* url param은 string이기 때문에 parseInt 로 변형시켜줘야 함 */}
                        </span>
                    </div>
                    <div>
                        <span className="articleTitle">{article?.title ?? ""}</span>
                        <div className="articleDateViews">
                            <span className="articleDate">{article?.insertDate ? new Date(article?.insertDate).toLocaleString() : ""}</span>
                            <span className="articleViews">
                                <span>조회수 : </span>
                                <span>{article?.views ?? ""}</span>
                            </span>
                        </div>
                        {/* insertDate가 있으면 new Date().toLocaleString()이 입력되고 없으면 ""로 입력됨 */}
                        {/* Date를 toString()하는 이유는 react에서 Date 형태는 바로 렌더링되지 않기 때문 */}
                        <span className="articleContent">{article?.content ?? ""}</span>
                    </div>
                    <div className="articleBtn">
                        <button onClick={onClickUpdateButton} className="mdfBtn">수정</button>
                        <span className="btnLine"></span>
                        <button onClick={onClickDeleteButton} className="delBtn">삭제</button>
                    </div>
                    <div className="articleComment">
                        <Comment articleId={params?.articleId ?? 0} />
                    </div>
                </>
                :
                <>
                    <div>
                        <span>{status}</span>
                    </div>
                    <div>
                        <span>{statusText}</span>
                    </div>
                </>
            }
        </div>
    );
}

export default Article;