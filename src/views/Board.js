import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { boardActions } from "../slices/boardSlice";



function Board() {
    const dispatch = useDispatch();

    const boardList = useSelector((state) => state.boardReducer.boardList);
    const status = useSelector((state) => state.boardReducer.status);
    const statusText = useSelector((state) => state.boardReducer.statusText);

    useEffect(() => {
        dispatch(boardActions.getBoardList());
    }, [dispatch])

    return (
        <>
            {
                status === 200 ?
                <div>
                    <ul>
                        <li key={0}>
                            <Link to="/">
                                <span>Main</span>
                            </Link>
                        </li>
                        {
                            boardList.length > 0 ?
                            boardList.map((board) => (
                                <li key={board?.id}>
                                    <Link to={{ pathname: `/board/${board?.id}` }}>
                                        <span>{board?.name}</span>
                                    </Link>
                                </li>
                            ))
                            : <div>게시판이 없습니다.</div>
                        }
                    </ul>
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
        </>
    )
}

export default Board;