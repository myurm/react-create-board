import { configureStore } from "@reduxjs/toolkit"; // configurse 지움
import createSagaMiddleware from "redux-saga";
import rootSaga from "../rootSaga";
import rootReducer from "../rootReducer";
import history from "./history";
import logger from "redux-logger";


const sagaMiddleware = createSagaMiddleware({
    context: { history : history },
});

const initialState = {};

const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware, logger],
    devTools: true,
    preloadedState: initialState,
});

sagaMiddleware.run(rootSaga); // saga 실행

export default store