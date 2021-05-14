import React from 'react';
import Board from "./views/Board";
import Routes from "./routes/Routes";
import "./Views.css";
import { useHistory } from 'react-router-dom';

function Views() {
    const history = useHistory();

    function onClickNewPostButton() {
        history.push("/insert");
    }

    function onClickControlButton() {
        history.push("/control");
    }

    return (
        <div className="wrap">
            <div id="header" className="header">
                <h3>미람게시판</h3>
            </div>
            <div className="btnWrap">
                <button onClick={onClickNewPostButton} className="newBtn">새글</button>
                <button onClick={onClickControlButton} className="setBtn">설정</button>
            </div>
            <div id="sidebar" className="sidebar">
                <Board />
            </div>
            <div id="content" className="content">
                <Routes />
            </div>
        </div>
    );
}

export default Views;