import type { AppStore } from "../store/store";
import { makeStore } from "../store/store";
import type { managerState } from "../features/manager/manager-slice";
import {
  setCommentId,
  setMyId,
  setPostId,
  setUserId,
  selectCommentId,
  selectPostId,
  selectMyId,
  selectUserId,
  managerSlice,
} from "../features/manager/manager-slice";

interface LocalTestContext {
  store: AppStore;
}

describe<LocalTestContext>("manager reducer", (it) => {
  beforeEach<LocalTestContext>((context) => {
    const initialState: managerState = {
      commentId: "1",
      postId: "1",
      myId: "1",
      userId: "1",
    };

    const store = makeStore({ manager: initialState });

    context.store = store;
  });

  it("should handle initial state", () => {
    expect(managerSlice.reducer(undefined, { type: "unknown" })).toStrictEqual({
      commentId: "0",
      postId: "0",
      myId: "0",
      userId: "0",
    });
  });

  it("should set Conversation State", ({ store }) => {
    expect(selectCommentId(store.getState())).toBe("1");

    store.dispatch(setCommentId("1234"));

    expect(selectCommentId(store.getState())).toBe("1234");
  });

  it("should set Group State", ({ store }) => {
    expect(selectPostId(store.getState())).toBe("1");

    store.dispatch(setPostId("4567"));

    expect(selectPostId(store.getState())).toBe("4567");
  });

  it("should set My State", ({ store }) => {
    expect(selectMyId(store.getState())).toBe("1");

    store.dispatch(setMyId("12asdas"));

    expect(selectMyId(store.getState())).toBe("12asdas");
  });

  it("should set User State", ({ store }) => {
    expect(selectUserId(store.getState())).toBe("1");

    store.dispatch(setUserId("d5665fg"));

    expect(selectUserId(store.getState())).toBe("d5665fg");
  });
});
