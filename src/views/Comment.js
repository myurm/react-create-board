import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { commentActions, commnetActions } from "../slices/commentSlice";

function Comment() {

    const dispatch = useDispatch();

    // state
    const commentList = useSelector((state) => state.commentReducer.commentList);
    const status = useSelector((state) => state.commentReducer.status);
    const statusText = useSelector((state) => state.commentReducer.statusText);

    // useEffect
    useEffect(() => {
        dispatch(commentActions.getCommonList(articleId));
    }, [dispatch, articleId])

    return (
        <>
            <div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={onClickInsertCommentButton}>등록</button>
            </div>
            <div>
                {
                    status === 200 ?
                    commentList.length > 0 ?
                    
                }
            </div>
        </>
    )
}

export default Comment;