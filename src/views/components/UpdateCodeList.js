import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { codeActions } from "../../slices/codeSlice";
import "./css/UpdateBoardList.css";

function UpdateCodeList({setShowUpdateCodeList}) {
    const dispatch = useDispatch();

    // state
    const codeList = useSelector((state) => state.codeReducer.codeList);
    const status = useSelector((state) => state.codeReducer.status);
    const statusText = useSelector((state) => state.codeReducer.statusText);

    const [ updatedCodeList, setUpdatedCodeList ] = useState(codeList ?? []);

    // event
    function onChangeCode(e) {
        const copiedCodeList = [ ...updatedCodeList ];
        copiedCodeList[e.target?.dataset?.index] = {
            ...copiedCodeList[e.target?.dataset.index],
            [e.target?.name]: e.target?.value
        };
        setUpdatedCodeList(copiedCodeList);
    }
    function onClickSubmitButton(updatedCode) {
        if(!updatedCode?.value || !updatedCode.desc || updatedCode?.value === "" || updatedCode?.desc === "") {
            alert("빠짐없이 입력해 주세요.");
        } else {
            dispatch(codeActions.putCode(updatedCode));
        }
    }
    function onClickDeleteButton(codeId) {
        if(!window.confirm("삭제하시겠습니까?")) {
            return false;
        }
        dispatch(codeActions.deleteCode(codeId));
    }

    useEffect(() => {
        dispatch(codeActions.getCodeList()); // code List 조회
    }, [dispatch]);

    useEffect(() => {
        setUpdatedCodeList(codeList);
    }, [dispatch]);

    return (
        <div className="updateCodeWrap">
            {
                status === 200 ?
                updatedCodeList.length > 0 ?
                updatedCodeList.map((updatedCode, index) =>
                    <>
                        <div>
                            <span>코드 설명</span>
                            <input
                                name="desc"
                                value={updatedCode?.desc ?? ""}
                                data-index={index}
                                onChange={onChangeCode}
                                className="updateCodeInput"
                            />
                        </div>
                        <div>
                            <span>게시판 코드값</span>
                            <input
                                name="value"
                                value={updatedCode?.value ?? ""}
                                data-index={index}
                                onChange={onChangeCode}
                                className="updateCodeInput"
                            />
                        </div>
                        <div>
                            <button onClick={() => onClickSubmitButton(updatedCode)} className="updateCodeSubmitBtn">저장</button>
                        </div>
                        <div>
                            <button onClick={() => onClickDeleteButton(updatedCode?.id ?? 0)} className="updateCodeDelBtn">삭제</button>
                        </div>
                    </>
                )
                :
                <div>
                    수정할 코드가 없습니다.
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
    )
}

export default UpdateCodeList;