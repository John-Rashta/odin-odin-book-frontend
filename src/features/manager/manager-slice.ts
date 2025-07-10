import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface managerState {
  myId: string;
}

const initialState: managerState = {
  myId: "0",
};

export const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: (create) => ({
    setMyId: create.reducer((state, action: PayloadAction<string>) => {
      state.myId = action.payload;
    }),
  }),
  selectors: {
    selectMyId: (data) => data.myId,
  },
});

export const { setMyId } =
  managerSlice.actions;
export const { selectMyId } =
  managerSlice.selectors;
