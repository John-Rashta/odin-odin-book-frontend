import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  loggedIn: boolean;
}

const initialState: AuthState = {
  loggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    setAuthState: create.reducer((state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    }),
  }),
  selectors: {
    selectAuthState: (data) => data.loggedIn,
  },
});

export const { setAuthState } = authSlice.actions;
export const { selectAuthState } = authSlice.selectors;
