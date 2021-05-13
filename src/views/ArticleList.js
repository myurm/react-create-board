import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { articleActions } from "../slices/articleSlice";
import { Link, useParams } from "react-router-dom";
// useParams : 렌더링 된 경로에 대한 매개 변수의 key / value 객체를 반환함 (parameter 값만 가져옴)
import "./css/ArticleList.css";

function ArticleList() {
    const params = useParams();
    const dispatch = useDispatch();

    const status = useSelector((state) => state.articleReducer.status);
    const articleList = useSelector((state) => state.articleReducer.articleList);
    const statusText = useSelector((state) => state.articleReducer.statusText);
    const boardList = useSelector((state) => state.boardReducer.boardList);

    useEffect(() => {
        dispatch(articleActions.getArticleList(params?.boardId ?? 0));
        // params가 boardId의 값을 객체로 반환시켜주고 없으면 0으로 만드는 것이여. 아마도
    }, [dispatch, params?.boardId]);

    return (
        <div className="listWrap">
            {
                status === 200 ?
                <>
                    <div>
                        <h3 className="listTitle">
                            {
                                boardList.length > 0 &&
                                boardList.find((board) => board.id === parseInt(params?.boardId))?.name
                            }
                            {/* find() : 배열의 조건에 맞는 값 중 첫 번째 요소의 값을 반환함
                                맞는 값이 없으면 undefined를 반환함 */}
                            {/* boardList의 길이가 0보다 크고, boardList 중 board.id가 해당 boardId(parseInt로 숫자로 변환함)와 같다면 name을 출력 */}
                        </h3>
                    </div>
                    {/* 상세 게시판 길이 */}
                    { articleList.length > 0 ?
                        <div>
                            {
                                articleList.map((article, index) =>
                                    <div key={article?.id ?? index} className="listLinkWrap">
                                        <Link to={{ pathname: `/article/${article?.id ?? 0}`}} className="listLink">
                                            <span>{article?.title ?? ""}</span>
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                        :
                        <div className="noBoard">게시글이 없습니다.</div>
                    }
                </>
                :
                <>
                    <div>
                        <span>{status}</span>
                        {/* error 숫자 */}
                    </div>
                    <div>
                        <span>{statusText}</span>
                        {/* Network Error */}
                    </div>
                </>
            }
        </div>
    )
}

export default ArticleList;