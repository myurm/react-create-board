import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { codeActions } from "../../slices/codeSlice";
import "./css/CreateCode.css";

function CreateCode({setShowCreateCode}) {
    const dispatch = useDispatch();

    //state
    const [ code, setCode ] = useState({});
    
    // event
    function onChangeCode(e) {
        setCode({
            ...code,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }
    function onClickSubmitButton() {
        if (code.value !== "" && code.desc !== "") {
            dispatch(codeActions.postCode({ code, setShowCreateCode}));
        } else {
            alert("빠짐없이 입력해 주세요.");
        }
    }

    // init
    return (
        <div className="createCodeWrap">
            <div>
                <span>코드명</span>
                <input name="desc" onChange={onChangeCode} value={code?.desc ?? ""} className="createCodeInput" />
            </div>
            <div>
                <span>코드 설정값</span>
                <input name="value" onChange={onChangeCode} value={code?.value ?? ""} className="createCodeInput" />
            </div>
            <div>
                <button onClick={onClickSubmitButton} className="createCodeBtn">등록</button>
            </div>
        </div>
    )
}

export default CreateCode;