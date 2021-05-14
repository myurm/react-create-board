import { createSlice } from "@reduxjs/toolkit";

const name = "article";

const initialState = {
    article: {},
    articleList: [],
    status: 0,
    statusText: "Loading",
};

const reducers = {
    // getArticleList
    getArticleList: () => {},
    getArticleListSuccess: (state, action) => {
        state.articleList = action.payload?.data ?? [];
        state.status = action.payload?.status;
        state.statusText = action.payload?.statusText ?? "Success";
    },
    getArticleListFail: (state, action) => {
        state.articleList = initialState.articleList;
        state.status = action.payload?.status ?? 500;
        state.statusText = action.payload?.statusText ?? "Network Error";
    },

    // getArticle
    getArticle: () => {},
    getArticleSuccess: () => {},
    getArtcileFail: (state, action) => {
        state.article = initialState.article;
        state.status = action.payload?.stauts ?? 500;
        state.statusText = action.payload?.statusText ?? "Network Error";
    },
    // getArticle updateViews (조회수)
    updateArticleViews: () => {},
    updateArticleViewsSuccess: (state, action) => {
        state.article = action.payload?.data ?? {};
        state.status = action.payload?.status;
        state.statusText = action.payload?.statusText ?? "Success";
    },
    updateArticleVeiwsFail: (state, action) => {
        state.article = initialState.article;
        state.status = action.payload?.status ?? 500;
        state.statusText = action.payload?.statusText ?? "Networt Error";
    },

    // post
    postArticle: () => {},
    postArticleSuccess: () => {},
    postArticleFail: (state, action) => {
        state.status = action.payload?.status ?? 500;
        state.statusText = action.payload?.statusText ?? "Network Error";
    },

    // modify
    setArticle: () => {},

    // put
    putArticle: () => {},
    putArticleSuccess: () => {},
    putArticleFail: (state, action) => {
        state.status = action.payload?.status ?? 500;
        state.statusText = action.payload?.statusText ?? "Network Error";
    },

    // delete
    deleteArticle: () => {},
    deleteArticleSuccess: (state, action) => {
        state.article = initialState.article;
        state.status = action.payload?.status;
        state.statusText = action.payload?.statusText ?? "Success";
    },
    deleteArticleFail: (state, action) => {
        state.status = action.payload?.status ?? 500;
        state.statusText = action.payload?.statusText ?? "Network Error";
    }
};

const articleSlice = createSlice({
    name,
    initialState,
    reducers
});

export const articleReducer = articleSlice.reducer;
export const articleActions = articleSlice.actions;