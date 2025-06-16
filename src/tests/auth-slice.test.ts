import type { AppStore } from "../store/store";
import { makeStore } from "../store/store";
import type { AuthState } from "../features/auth/auth-slice";
import {
  selectAuthState,
  setAuthState,
  authSlice,
} from "../features/auth/auth-slice";

interface LocalTestContext {
  store: AppStore;
}

describe<LocalTestContext>("auth reducer", (it) => {
  beforeEach<LocalTestContext>((context) => {
    const initialState: AuthState = {
      loggedIn: true,
    };

    const store = makeStore({ auth: initialState });

    context.store = store;
  });

  it("should handle initial state", () => {
    expect(authSlice.reducer(undefined, { type: "unknown" })).toStrictEqual({
      loggedIn: false,
    });
  });

  it("should set Auth State", ({ store }) => {
    expect(selectAuthState(store.getState())).toBe(true);

    store.dispatch(setAuthState(false));

    expect(selectAuthState(store.getState())).toBe(false);
  });
});
