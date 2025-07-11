import type { AppStore } from "../store/store";
import { makeStore } from "../store/store";
import type { managerState } from "../features/manager/manager-slice";
import {
  setMyId,
  selectMyId,
  managerSlice,
} from "../features/manager/manager-slice";

interface LocalTestContext {
  store: AppStore;
}

describe<LocalTestContext>("manager reducer", (it) => {
  beforeEach<LocalTestContext>((context) => {
    const initialState: managerState = {
      myId: "1",
    };

    const store = makeStore({ manager: initialState });

    context.store = store;
  });

  it("should handle initial state", () => {
    expect(managerSlice.reducer(undefined, { type: "unknown" })).toStrictEqual({
      myId: "0",
    });
  });

  it("should set My State", ({ store }) => {
    expect(selectMyId(store.getState())).toBe("1");

    store.dispatch(setMyId("12asdas"));

    expect(selectMyId(store.getState())).toBe("12asdas");
  });
});
