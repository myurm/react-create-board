import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// 추가
import { Router } from "react-router-dom";
// import { BrowserRouter } from "react-router-dom";
/* BrowserRouter를 사용하면 history는 필요없지만 BrowserRouter를 사용하지 않고 Router를 사용하는 이유는 redux-saga라는 외부 라이브러리로 history에 접근하기 위해 사용함
  그래서 history를 router의 props로 보내줘야 함*/
import { Provider } from "react-redux";
import store from "./utils/store";
import history from "./utils/history";

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);