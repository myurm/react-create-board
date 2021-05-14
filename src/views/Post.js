import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { SELECT } from "../utils/events";
import { articleActions } from "../slices/articleSlice";
import { useHistory, useParams } from "react-router-dom";
import "./css/Post.css";

function Post() {
    const dispatch = useDispatch();
    const params = useParams();
    const history = useHistory();

    const boardList = useSelector((state) => state.boardReducer.boardList);
    const boardStatus = useSelector((state) => state.boardReducer.status);
    const boardStatusText = useSelector((state) => state.boardReducer.statusText);
    const articleStatus = useSelector((state) => state.articleReducer.status);
    const articleStatusText = useSelector((state) => state.articleReducer.statusText);

    const [ article, setArticle ] = useState({});
    // 변수, set변수 = 변수는 {} 가 됨

    function onChangeArticle(e) {
        setArticle({
            ...article,
            [e.currentTarget.name]: e.currentTarget.value
            // [key]: value -> key는 article 중 하나이기 때문에 []로 감싸줘야 함 === article[name]
        });
    }
    function onClickSubmitButton() {
        if(article?.boardId > 0 && article.title) {
            if(article?.id > 0) { // 게시글 id 존재 여부 확인
                dispatch(articleActions.putArticle(article)); // 수정 후 등록
            } else {
                dispatch(articleActions.postArticle(article)); // 새 글 등록
            }
        } else {
            alert("게시판과 제목은 필수값입니다.");
        }
    }

    function onClickMoveToControlButton() {
        history.push("/control");
    }
    
    useEffect(() => {
        if(params?.articleId) {
            dispatch(articleActions.setArticle({ articleId: params?.articleId, setArticle }));
            // setArticle은 article 변경값
        } else {
            setArticle({}); // 새 글 쓰기
        }
    }, [dispatch, params?.articleId]);

    return (
        <div className="postWrap">
            { boardStatus === 200 && boardList.length > 0 ?
                (
                    <>
                        <h3 className="listTitle">새 글쓰기</h3>
                        <div>
                            <span className="PostTitle">게시판</span>
                            <select
                                name="boardId"
                                onChange={onChangeArticle}
                                value={article?.boardId ?? 0}
                                className="postSelect"
                            >
                                <option value={SELECT.id} key={SELECT.id}>{SELECT.name}</option>
                                {/* id = 0 , name = "선택" */}
                                {
                                    boardList.map((board) => (
                                        <option value={board?.id}>{board?.name ?? ""}</option>
                                    ))
                                }
                                {/* id값에 따라 option name이 달라지고 id 수 만큼 map 적용됨 */}
                            </select>
                        </div>
                        <div>
                            <span className="PostTitle">제목</span>
                            <input
                                name="title"
                                onChange={onChangeArticle}
                                value={article?.title ?? ""}
                                className="postInput"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <span className="PostTitle">내용</span>
                            <textarea
                                name="content"
                                onChange={onChangeArticle}
                                value={article?.content ?? ""}
                                className="postTxt"
                            />
                        </div>
                        <button
                            onClick={onClickSubmitButton}
                            className="submitBtn"
                        >
                            등록
                        </button>
                    </>
                ) : boardStatus === 200 && boardList.length === 0 ? (
                    <>
                        <span className="noPost">게시판 등록이 필요합니다.</span>
                        <button onClick={onClickMoveToControlButton} className="goSet">설정</button>
                    </>
                ) : (
                    <>
                        <div>
                            <span>{boardStatus}</span>
                        </div>
                        <div>
                            <span>{boardStatusText}</span>
                        </div>
                    </>
                )
            }
            {/* 등록이나 수정에서 실패할 경우 */}
            { articleStatus !== 200 && articleStatus !== 0 && (
                <>
                    <div>
                        <span>{articleStatus}</span>
                    </div>
                    <div>
                        <span>{articleStatusText}</span>
                    </div>
                </>
            )}
        </div>
    )
}

export default Post;