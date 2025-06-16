import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../features/auth/auth-slice";
import { managerSlice } from "../../features/manager/manager-slice";

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineSlices(authSlice, managerSlice);

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];