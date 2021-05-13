import { createSlice } from "@reduxjs/toolkit";

const name = "Code";

const initialState = {
    codeList: [],
    status: 0,
    statusText: "Loading. . ."
};

const reducers = {
    // codeList 조회
    getCodeList: () => {},
    getCodeListSuccess: (state, action) => {
        state.codeList = action.payload?.data ?? [];
        state.status = action.payload?.status;
        state.statusText = action.payload?.statusText ?? "Success";
    },
    getCodeListFail: (state, action) => {
        state.codeList = initialState.codeList;
        state.status = action.payload?.status ?? 500;
        state.statusText = action.payload?.statusText ?? "Network Error";
    },

    // code 조회
    getCode: () => {},
    getCodeSuccess: () => {},
    getCodeFail: () => {},
    
    // code 신규 저장
    postCode: () => {},
    postCodeSuccess: () => {},
    postCodeFail: () => {},

    // code 수정
    putCode: () => {},
    putCodeSuccess: () => {},
    putCodeFail: () => {},

    // code 삭제
    deleteCode: () => {},
    deleteCodeSuccess: () => {},
    deleteCodeFail: () => {}
};

const codeSlice = createSlice({
    name,
    initialState,
    reducers
});

export const codeReducer = codeSlice.reducer;
export const codeActions = codeSlice.actions;