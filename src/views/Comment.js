import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { commentActions } from "../slices/commentSlice";
import "./css/Comment.css";

function Comment({ articleId }) {
    // articleId에 {} 안 하면 조회가 제대로 안 됨
    const dispatch = useDispatch();

    // state
    const commentList = useSelector((state) => state.commentReducer.commentList);
    const status = useSelector((state) => state.commentReducer.status);
    const statusText = useSelector((state) => state.commentReducer.statusText);

    const [ newComment , setNewComment ] = useState("");

    // event
    function onClickInsertCommentButton() {
        if(newComment.length <= 0 || newComment.trim() === ""){
            alert("댓글을 입력해 주세요.");
            setNewComment("");
            return;
        } else {
            dispatch(commentActions.insertComment(newComment));
            setNewComment("");
        }
    }
    function onClickDeleteCommentButton(commentId) {
        if(!window.confirm("삭제하시겠습니까?")){
            return false;
        }
        dispatch(commentActions.deleteComment(commentId));
    }

    // useEffect
    useEffect(() => {
        dispatch(commentActions.getCommentList(articleId));
    }, [dispatch, articleId]);

    return (
        <>
            <div className="commentWrap">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="commentTxt"
                    maxLength="100"
                    placeholder="100자 이내로 작성해 주세요."
                />
                <button onClick={onClickInsertCommentButton} className="commentBtn" >등록</button>
            </div>
            <div className="commentBoard">
                {
                    status === 200 ?
                    commentList.length > 0 ?
                    commentList.map((comment, index) => (
                        <div className="commentTxtWrap">
                            <div className="commentDateDelBtn">
                                <span className="commentDate">{(comment?.insertDate) ? new Date(comment?.insertDate).toLocaleString() : ""}</span>
                                <button onClick={() => onClickDeleteCommentButton(comment?.id ?? 0)} className="commentDelBtn">⨉</button>
                            </div>
                            <div key={comment?.id ?? index}>
                                <span className="commentContent">{comment?.content.split("\n").map(line => <span>{line}<br/></span>)}</span>
                            </div>
                        </div>
                    ))
                    :
                    <div className="noComment">
                        댓글이 없습니다.
                        <br />
                        가장 먼저 댓글을 작성해 보세요 :&gt;
                    </div>
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
        </>
    )
}

export default Comment;