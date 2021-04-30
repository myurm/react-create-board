import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { articleActions } from "./../slices/articleSlice";
import Comment from "./Comment";

function Article() {
    const dispatch = useDispatch();
    const params = useParams();
    // const history = useHistory();

    // state
    const article = useSelector((state) => state.articleReducer.article);
    const status = useSelector((state) => state.articleReducer.status);
    const statusText = useSelector((state) => state.articleReducer.statusText);
    const boardList = useSelector((state) => state.boardReducer.boardList);

    // useEffect
    useEffect(() => {
        dispatch(articleActions.getArticle(params?.articleId ?? 0)); // dispatch(파일actions.action(payload));
    }, [dispatch, params?.articleId])

    return (
        <>
            {
                status === 200 ?
                <>
                    <div>
                        <span>게시판 : </span>
                        <span>
                            {
                                boardList.length > 0 &&
                                boardList.find((board) => board.id === parseInt(article?.boardId))?.name
                            }
                            {/* url param은 string이기 때문에 parseInt 로 변형시켜줘야 함 */}
                        </span>
                    </div>
                    <div>
                        <div><span>제목 : </span><span>{article?.title ?? ""}</span></div>
                        <div><span>조회수 : </span><span>{article?.views ?? ""}</span></div>
                        <div><span>작성일시 : </span><span>{article?.insertDate ? new Date(article?.insertDate).toLocaleString() : ""}</span></div>
                        {/* insertDate가 있으면 new Date().toLocaleString()이 입력되고 없으면 ""로 입력됨 */}
                        {/* Date를 toString()하는 이유는 react에서 Date 형태는 바로 렌더링되지 않기 때문 */}
                        <div><span>내용 : </span><span>{article?.content ?? ""}</span></div>
                    </div>
                    <div>
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
        </>
    );
}

export default Article;