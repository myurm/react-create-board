import React, { useState } from 'react';
import CreateBoard from "./components/CreateBoard";
import CreateCode from "./components/CreateCode";
import UpdateBoardList from "./components/UpdateBoardList";
import UpdateCodeList from "./components/UpdateCodeList";
import "./css/Control.css";

function Control() {
    // false = hide / true = show
    const [ showCreateCode, setShowCreateCode ] = useState(false);
    const [ showUpdateCodeList, setShowUpdateCodeList ] = useState(false);
    const [ showCreateBoard, setShowCreateBoard ] = useState(false);
    const [ showUpdateBoardList, setShowUpdateBoardList ] = useState(false);

    // 새 코드
    function onClickCreateCodeButton() {
        (showCreateCode) ? setShowCreateCode(false) : setShowCreateCode(true);
        // show, hide 반복
    }
    // 코드 목록 수정
    function onClickUpdateCodeList() {
        (showUpdateCodeList) ? setShowUpdateCodeList(false) : setShowUpdateCodeList(true);
    }
    // 새 게시판
    function onClickCreateBoardButton() {
        (showCreateBoard) ? setShowCreateBoard(false) : setShowCreateBoard(true);
    }
    // 게시판 목록 수정
    function onClickUpdateBoardList() {
        (showUpdateBoardList) ? setShowUpdateBoardList(false) : setShowUpdateBoardList(true);
    }

    return (
        <div className="controlWrap">
            <h3 className="controlTitle">설정</h3>
            <div>
                <div>
                    <div>
                        <div>
                            <button onClick={onClickCreateCodeButton} className="controlBtn">새 코드</button>
                        </div>
                        <div>
                            { showCreateCode && <CreateCode SetShowCreateCode={setShowCreateCode} /> }
                            {/* true면 <CreateCode /> show */}
                        </div>
                    </div>
                    <div>
                        <div>
                            <button onClick={onClickUpdateCodeList} className="controlBtn">코드 목록 수정</button>
                        </div>
                        <div>
                            { showUpdateCodeList && <UpdateCodeList setUpdateCodeList={setShowUpdateCodeList} /> }
                            {/* true면 <UpdateCodeList /> show */}
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <button onClick={onClickCreateBoardButton} className="controlBtn">새 게시판</button>
                        </div>
                        <div>
                            { showCreateBoard && <CreateBoard setShowCreateBoard={setShowCreateBoard} /> }
                            {/* true면 <CreateBoard /> show */}
                        </div>
                    </div>
                    <div>
                        <div>
                            <button onClick={onClickUpdateBoardList} className="controlBtn">게시판 목록 수정</button>
                        </div>
                        <div>
                            { showUpdateBoardList && <UpdateBoardList setUpdateBoardList={setShowUpdateBoardList} /> }
                            {/* true면 <UpdateBoardList /> show */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Control;
