import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { boardActions } from "../../slices/boardSlice";
import { codeActions } from "../../slices/codeSlice";
import "./css/CreateBoard.css";

function CreateBoard({setShowCreateBoard}) {
    // setShowCreateBoard는 Control.js에서 받아오는 거임

    const dispatch = useDispatch();

    // state
    const codeList = useSelector((state) => state.codeReducer.codeList);
    const codeStatus = useSelector((state) => state.codeReducer.status);
    const codeStatusText = useSelector((state) => state.codeReducer.statusText);
    const [ board, setBoard ] = useState({});
    // board 안의 값

    // event
    function onChangeArticle(e) {
        setBoard({
            ...board,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }
    function onClickSubmitButton() {
        if(board?.name) {
            dispatch(boardActions.postBoard({ board, setShowCreateBoard }));
        } else {
            alert("게시판 이름은 필수값입니다.");
        }
    }

    // init
    useEffect(() => {
        dispatch(codeActions.getCodeList());
    }, [dispatch]);
    return (
        <div className="createBoardWrap">
            {
                codeStatus === 200 ? 
                codeList.length > 0 ?
                <>
                    <div>
                        <span>게시판 명</span>
                        <input name="name" onChange={onChangeArticle} className="createBoardInput" autoComplete="off" />
                    </div>
                    <div>
                        <span>사용 코드</span>
                        <select name="code" onChange={onChangeArticle} className="createBoardSelect">
                            <option value="">선택</option>
                            { codeList.map((code) => (
                                <option value={code?.value}>{code?.desc ?? ""}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button onClick={onClickSubmitButton} className="createBoardBtn">등록</button>
                    </div>
                </>
            :
                <div>코드등록이 필요합니다.</div>
            :
                <>
                    <div>
                        <span>{codeStatus}</span>
                    </div>
                    <div>
                        <span>{codeStatusText}</span>
                    </div>
                </>
            }
        </div>
    )
}

export default CreateBoard;