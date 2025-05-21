import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface managerState {
  myId: string;
  userId: string;
  postId: string;
  commentId: string;
}

const initialState: managerState = {
  myId: "0",
  userId: "0",
  postId: "0",
  commentId: "0",
};

export const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: (create) => ({
    setMyId: create.reducer((state, action: PayloadAction<string>) => {
      state.myId = action.payload;
    }),
    setUserId: create.reducer((state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    }),
    setPostId: create.reducer((state, action: PayloadAction<string>) => {
      state.postId = action.payload;
    }),
    setCommentId: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.commentId = action.payload;
      },
    ),
  }),
  selectors: {
    selectMyId: (data) => data.myId,
    selectUserId: (data) => data.userId,
    selectPostId: (data) => data.postId,
    selectCommentId: (data) => data.commentId,
  },
});

export const { setCommentId, setPostId, setUserId, setMyId } =
  managerSlice.actions;
export const { selectCommentId, selectPostId, selectUserId, selectMyId } =
  managerSlice.selectors;
