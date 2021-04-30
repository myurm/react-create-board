import { createSlice } from "@reduxjs/toolkit";

const name = "comment";

const initialState = {
    commentList: [],
    status: 0,
    statusText: "Loading"
};

const reducers = {
    // get (조회)
    getCommonList: () => {},
    getCommonListSuccess: (state, action) => {
        state.commentList = action.payload?.data ?? [];
        state.status = action.payload?.status;
        state.statusText = action.payload?.statusText ?? "Success";
    },
    getCommonListFail: (state, action) => {
        state.commentList = initialState.commentList;
        state.status = action.payload?.status ?? 500;
        state.statusText = action.payload?.statusText ?? "Network Error";
    },

    // insert (입력)
    insertComment: () => {},
    insertCommentSuccess: () => {},
    insertCommentFail: () => {},

    // delete (삭제)
    deleteComment: () => {},
    deleteCommentSuccess: () => {},
    deleteCommentFail: () => {}
};

const commentSlice = createSlice({
    name,
    initialState,
    reducers
});

export const commentReducer = commentSlice.reducer;
export const commentActions = commentSlice.actions;