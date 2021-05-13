import { createSlice } from "@reduxjs/toolkit";

const name = "board";

const initialState = {
    boardList: [],
    status: 0,
    statusText: "Loading"
};

const reducers = {
    getBoardList: () => {},
    getBoardListSuccess: (state, action) => {
        // .? (Optional chaining) : payload가 undefined일 경우 Cannot find `data` of undefined 이런 식의 오류가 나는 것을 방지해줌 (오류는 뜨지 않고 undefined라고 값이 입력됨)
        // ?? : null 병합 연산자 ex. x = a ?? b 에서 a가 null 혹은 undefined일 경우 b를 return
        // ??과 ||의 차이 : ||는 true냐 false냐를 판단하지만 ??는 null이냐 undefined냐를 판단하기 때문에 값이 있을 경우 비교값과 달라도 기존의 값을 반환함
        state.boardList = action.payload?.data ?? [];
        // action.payload의 data가 undefined일 경우 오류나는 것을 방지, [] 값을 불러옴
        state.status = action.payload?.status;
        state.statusText = action.payload?.statusText ?? "Success";
        // action.payload의 statusText가 undefined일 경우 오류나는 것을 방지, "Success"를 띄움
    },
    getBoardListFail: (state, action) => {
        state.boardList = initialState.boardList;
        state.status = action.paylaod?.status ?? 500;
        state.statusText = action.payload?.statusText ?? "Network Error";
    },

    // board 조회
    getBoard: () => {},
    getBoardSuccess: () => {},
    getBoardFail: () => {},

    // board 신규 저장
    postBoard: () => {},
    postBoardSuccess: () => {},
    postBoardFail: () => {},

    // board 수정
    putBoard: () => {},
    putBoardSuccess: () => {},
    putBoardFail: () => {},

    // board 삭제
    deleteBoard: () => {},
    deleteBoardSuccess: () => {},
    deleteBoardFail: () => {}
};

const boardSlice = createSlice({
    name,
    initialState,
    reducers
});

export const boardReducer = boardSlice.reducer;
export const boardActions = boardSlice.actions;