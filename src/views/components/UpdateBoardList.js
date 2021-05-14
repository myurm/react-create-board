import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { boardActions } from "../../slices/boardSlice";
import { codeActions } from "../../slices/codeSlice";
import "./css/UpdateBoardList.css";

function UpdateBoardList({ setShowUpdateBoardList }) {
    const dispatch = useDispatch();

    // state
    const boardList = useSelector((state) => state.boardReducer.boardList);
    const boardStatus = useSelector((state) => state.boardReducer.status);
    const boardStatusText = useSelector((state) => state.boardReducer.statusText);

    const codeList = useSelector((state) => state.codeReducer.codeList);
    const codeStatus = useSelector((state) => state.codeReducer.status);
    const codeStatusText = useSelector((state) => state.codeReducer.statusText);

    const [ updatedBoardList, setUpdatedBoardList ] = useState(boardList ?? []);
    
    // event
    function onChangeBoard(e) {
        const copiedBoardList = [ ...updatedBoardList ];
        // list마다 value가 다르게 들어가야 하므로 index 사용
        copiedBoardList[e.target?.dataset?.index] = {
            ...copiedBoardList[e.target?.dataset?.index],
            [e.target?.name]: e.target?.value
        };
        setUpdatedBoardList(copiedBoardList);
    }

    function onClickSubmitButton(updatedBoard) {
        if (!updatedBoard?.name || !updatedBoard.code || !updatedBoard?.name === "" || updatedBoard.code === "") {
            alert("빠짐없이 입력해주세요.");
        } else {
            dispatch(boardActions.putBoard(updatedBoard));
        }
    }

    function onClickDeleteButton(boardId) {
        if(!window.confirm("삭제하시겠습니까?")) {
            return false;
        }
        dispatch(boardActions.deleteBoard(boardId));
    }

    // init
    useEffect(() => {
        dispatch(boardActions.getBoardList());
        dispatch(codeActions.getCodeList());
    }, [dispatch]); // 최신 list 조회

    useEffect(() => {
        setUpdatedBoardList(boardList);
    }, [dispatch]); // updatedBoardList를 셋해줌

    return (
        <div className="updateBoardWrap">
            {
                boardStatus === 200 ?
                updatedBoardList.length > 0 ?
                updatedBoardList.map((updatedBoard, index) =>
                    <div className="updateBaordList">
                        <div>
                            <span>게시판 이름</span>
                            <input
                                name="name"
                                value={updatedBoard?.name ?? ""}
                                data-index={index}
                                onChange={onChangeBoard}
                                className="updateBoardInput"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <span>게시판 코드값</span>
                            {
                                codeStatus === 200 ?
                                codeList.length > 0 ?
                                    <select
                                        name="code"
                                        value={updatedBoard?.code ?? ""}
                                        data-index={index}
                                        onChange={onChangeBoard}
                                        className="updateBoardSelect"
                                    >
                                        <option value={""}>선택</option>
                                        {
                                            codeList.length > 0 &&
                                            codeList.map((code) => (
                                                <option value={code?.value}>{code.desc ?? ""}</option>
                                            ))
                                        }
                                    </select>
                                :
                                <div>
                                    코드등록이 필요합니다.
                                </div>
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
                        <div>
                            <button onClick={() => onClickSubmitButton(updatedBoard)} className="updateBoardSubmitBtn">저장</button>
                        </div>
                        <div>
                            <button onClick={() => onClickDeleteButton(updatedBoard?.id ?? 0)} className="updateBoardDelBtn">삭제</button>
                        </div>
                    </div>
                )
                :
                <div>
                    수정할 게시판이 없습니다.
                </div>
                :
                <>
                    <div>
                        <span>{boardStatus}</span>
                    </div>
                    <div>
                        <span>{boardStatusText}</span>
                    </div>
                </>
            }
        </div>
    )
}

export default UpdateBoardList;