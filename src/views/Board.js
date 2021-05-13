import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { boardActions } from "../slices/boardSlice";

import "./css/Board.css";

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
                        <li key={0} className="menu">
                            <Link to="/" className="link">
                                <span>HOME</span>
                            </Link>
                        </li>
                        {
                            boardList.length > 0 ?
                            boardList.map((board) => (
                                <li key={board?.id} className="menu">
                                    <Link to={{ pathname: `/board/${board?.id}` }} className="link">
                                        <span>{board?.name}</span>
                                    </Link>
                                </li>
                            ))
                            : <div className="menu dontTouch">게시판이 없습니다.</div>
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