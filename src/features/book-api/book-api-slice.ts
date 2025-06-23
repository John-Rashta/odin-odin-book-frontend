import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RequestInfo, ReceivedExtra, SentExtra, UserExtra, UserFollowType, UserInfo, FullPostInfo, Likes, YourLike, OwnCommentsCount, FullCommentInfo, ReturnMessage, NotificationsInfo } from "../../../util/interfaces";
import { getProperQuery } from "../../../util/helpers";
import { socket } from "../../../sockets/socket";
import { InitialPageParam, notificationTypes, requestTypes } from "../../../util/types";
import { NewPostSocket, PostUpdateSocket, UserUpdateSocket, BasicId, FollowersSocket, FollowsSocket, NotificationSocket, CommentUpdateSocket, CommentDeleteSocket, NewCommentSocket, RequestSocketOptions } from "../../../sockets/socketTypes";

interface Credentials {
  username: string;
  password: string;
};

interface UId {
    id: string;
};

interface IconInfo {
  id: number;
  source: string;
};

interface UpdateContent {
  content: string;
};

interface UpdatedPost {
  id: string;
  content: string;
  createdAt: Date;
  creatorid: string;
  edited: boolean;
};

interface LikeTypes {
  action: "ADD" | "REMOVE"
};

interface RequestCreate {
  id: string,
  type: requestTypes
};

interface CommentInfo {
  id: string;
  content: string;
  edited: boolean;
  commentid: string | null;
  postid: string;
  sentAt: Date;
  senderid: string;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000",
        credentials: "include",
    }),
    keepUnusedDataFor: 1,
    tagTypes: [
        "SelfInfo",
        "PostInfo",
        "PostsInfo",
        "UserPostsInfo",
        "CommentInfo",
        "CommentsInfo",
        "UserInfo",
        "UsersInfo",
        "SearchInfo",
        "SentInfo",
        "ReceivedInfo",
        "FeedInfo",
        "NotificationInfo",
        "NotificationsInfo",
        "PostCommentsInfo",
        "FollowersInfo",
        "FollowsInfo",
    ],
    endpoints: (builder) => ({
    createUser: builder.mutation<ReturnMessage, Credentials>({
      query: (body) => ({
        url: "/auth",
        method: "POST",
        body: body,
      }),
    }),
    loginUser: builder.mutation<UId, Credentials>({
      query: (body) => ({
        url: "/auth",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["SelfInfo"],
    }),
    logoutUser: builder.mutation<ReturnMessage, void>({
      query: () => ({
        url: "/auth",
        method: "DELETE",
      }),
    }),
    getSelf: builder.query<{ user: UserInfo }, void>({
      query: () => ({
        url: "/users/self",
      }),
      providesTags: ["SelfInfo"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: FollowersSocket) => {
          updateCachedData((draft) => {
            if (data.action ===  "REMOVE") {
              draft.user.followerCount -= 1;
            }
          });
        };

        const followsListener = (data: FollowsSocket) => {
          if (data.action === "ADD" && data.data) {
            socket.emitWithAck("follow:join", {id: data.data.id});
          } else if (data.action === "REMOVE" && data.id) {
            socket.emitWithAck("follow:leave", {id: data.id});
          }
        };
        try {
          await cacheDataLoaded;

          socket.on("followers", listener);
          socket.on("follows", followsListener);
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("followers", listener);
        socket.off("follows", followsListener);
      },
    }),
    searchUsers: builder.infiniteQuery<{ users: (UserInfo & UserExtra)[] }, string, InitialPageParam>({
      infiniteQueryOptions: {
        initialPageParam: {
          skip: 0,
          amount: 30,
        },
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
        ) => {
          if (lastPage.users.length === lastPageParam.amount) {
            return {
              skip: lastPageParam.amount + lastPageParam.skip,
              amount: lastPageParam.amount,
            }
          } else {
            return undefined;
          }
        },
      },
      query: ({pageParam, queryArg}) => ({
        url: `/users/search?user=${queryArg}${getProperQuery(pageParam).substring(1)}`,
      }),
      providesTags: ["SearchInfo"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: UserUpdateSocket) => {
          updateCachedData((draft) => {
            if (data.type === "user" && data.data) {
              draft.pages.forEach(({users}) => {
                const possibleIndex = users.findIndex((ele) => ele.id === data.id);
                if (possibleIndex !== -1) {
                  Object.assign(users[possibleIndex], data.data);
                }
              })
            }
          });
        };

        const followsListener = (data: FollowsSocket) => {
          if (data.action !== "ADD" || !data.data) {
            return;
          }
          updateCachedData((draft) => {
            draft.pages.forEach(({users}) => {
              const possibleIndex = users.findIndex((ele) => ele.id === data.data?.id);
              if (possibleIndex !== -1) {
                users[possibleIndex].followers = [{id: "1"}];
                users[possibleIndex].receivedRequests = undefined;
              }
            })
          });
        };

        const requestListener = (data: RequestSocketOptions) => {
          if (data.action !== "REMOVE" || !data.data.userid || !data.data.myid) {
            return;
          };

          if (data.data.userid === data.data.myid) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages.forEach(({users}) => {
              const possibleIndex = users.findIndex((ele) => ele.id === data.data.userid);
              if (possibleIndex !== -1) {
                users[possibleIndex].receivedRequests = undefined;
              }
            });
          })
        };
        try {
          await cacheDataLoaded;

          socket.on("user:updated", listener);
          socket.on("follows", followsListener);
          socket.on("request", requestListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("user:updated", listener);
        socket.off("follows", followsListener);
        socket.off("request", requestListener);
      },
    }),
    getUser: builder.query<{ user: (UserInfo & UserExtra) }, string>({
      query: (user) => ({
        url: `/users/${user}`,
      }),
      providesTags: (result, error, arg) => [ {type: "UserInfo", id: arg}],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: UserUpdateSocket) => {
          if (data.id !== arg) {
            return;
          }
          updateCachedData((draft) => {
            if (data.type ===  "followers" && data.newCount !== undefined) {
              draft.user.followerCount = data.newCount;
            } else if (data.type === "user" && data.data) {
              Object.assign(draft.user, data.data);
            }
          });
        };

         const followsListener = (data: FollowsSocket) => {
          if (data.action !== "ADD") {
            return;
          };

          if (!data.data || data.data.id !== arg) {
            return;
          };

           updateCachedData((draft) => {
            draft.user.followers = [{id: "1"}];
            draft.user.receivedRequests = undefined;
          });
        };

        const requestListener = (data: RequestSocketOptions) => {
          if (data.action !== "REMOVE" || !data.data.userid || !data.data.myid) {
            return;
          };

          if (data.data.userid !== arg) {
            return;
          }

          if (data.data.userid === data.data.myid) {
            return;
          };

          updateCachedData((draft) => {
            draft.user.receivedRequests = undefined;
          });
        };
        try {
          await cacheDataLoaded;

          const response = await socket.emitWithAck("user:join", {id: arg});
          socket.on("user:updated", listener);
          socket.on("follows", followsListener);
          socket.on("request", requestListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        const response = await socket.emitWithAck("user:leave", {id: arg});
        socket.off("user:updated", listener);
        socket.off("follows", followsListener);
        socket.off("request", requestListener);
      },
    }),
    getUsers: builder.infiniteQuery<{ users: (UserInfo & UserExtra)[] },void, InitialPageParam>({
      infiniteQueryOptions: {
        initialPageParam: {
          skip: 0,
          amount: 30,
        },
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
        ) => {
          if (lastPage.users.length === lastPageParam.amount) {
            return {
              skip: lastPageParam.amount + lastPageParam.skip,
              amount: lastPageParam.amount,
            }
          } else {
            return undefined;
          }
        },
      },
      query: ({pageParam}) => ({
        url: `/users${getProperQuery(pageParam)}`,
      }),
      providesTags: ["UsersInfo"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: UserUpdateSocket) => {
          updateCachedData((draft) => {
            if (data.type === "user" && data.data) {
              draft.pages.forEach(({users}) => {
                const possibleIndex = users.findIndex((ele) => ele.id === data.id);
                if (possibleIndex !== -1) {
                  Object.assign(users[possibleIndex], data.data);
                }
              })
            }
          });
        };

        const followsListener = (data: FollowsSocket) => {
          if (data.action !== "ADD" || !data.data) {
            return;
          }
          updateCachedData((draft) => {
            draft.pages.forEach(({users}) => {
              const possibleIndex = users.findIndex((ele) => ele.id === data.data?.id);
              if (possibleIndex !== -1) {
                users[possibleIndex].followers = [{id: "1"}];
                users[possibleIndex].receivedRequests = undefined;
              }
            })
          });
        };

        const requestListener = (data: RequestSocketOptions) => {
          if (data.action !== "REMOVE" || !data.data.userid || !data.data.myid) {
            return;
          };

          if (data.data.userid === data.data.myid) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages.forEach(({users}) => {
              const possibleIndex = users.findIndex((ele) => ele.id === data.data.userid);
              if (possibleIndex !== -1) {
                users[possibleIndex].receivedRequests = undefined;
              }
            });
          })
        };
        try {
          await cacheDataLoaded;

          socket.on("user:updated", listener);
          socket.on("follows", followsListener);
          socket.on("request", requestListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("user:updated", listener);
        socket.off("follows", followsListener);
        socket.off("request", requestListener);
      },
      /*
    getUsers: builder.query<{ users: (UserInfo & UserExtra)[] }, AmountOptions>({
      query: (options) => ({
        url: `/users${getProperQuery(options)}`,
      }),
      providesTags: (result = {users: []}, error, arg) => [
        "UsersInfo",
        ...result.users.map(({id}) => ({type: "UserInfo", id}) as const)
      ],
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {

        return endpointName
      },
      merge: (currentCache, newItems, {arg}) => {
        if (currentCache.users.length === arg.skip) {
          currentCache.users.push(...newItems.users);
        }
      }, */
      /*
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: UserUpdateSocket) => {
          updateCachedData((draft) => {
            if (data.type === "user" && data.data) {
              const possibleIndex = draft.users.findIndex((ele) => ele.id === data.id);
              if (possibleIndex) {
                Object.assign(draft.users[possibleIndex], data.data);
              }
            }
          });
        };
        try {
          await cacheDataLoaded;

          socket.on("user:updated", listener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("user:updated", listener);
      },
      */
    }),
    getUserPosts: builder.infiniteQuery<{ posts: (FullPostInfo & Likes & YourLike & OwnCommentsCount)[] }, string, InitialPageParam>({
      query: ({queryArg, pageParam}) => ({
        url: `/users/${queryArg}/posts${getProperQuery(pageParam)}`,
      }),
      infiniteQueryOptions: {
        initialPageParam: {
          skip: 0,
          amount: 30,
        },
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
        ) => {
          if (lastPage.posts.length === lastPageParam.amount) {
            return {
              skip: lastPageParam.amount + lastPageParam.skip,
              amount: lastPageParam.amount,
            }
          } else {
            return undefined;
          }
        },
      },
       async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const deleteListener = (data: BasicId) => {
          updateCachedData((draft) => {
            draft.pages.forEach(({posts}) => {
              const possibleIndex = posts.findIndex((ele) => ele.id === data.id);
              if (possibleIndex !== -1) {
                posts.splice(possibleIndex, 1);
              }
            })
          });
        };
        const newListener = (data: NewPostSocket) => {
          if (data.id !== arg) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages[0].posts.unshift({...data.post, ownCommentsCount:0});
          });
        };
        const updateListener = (data: PostUpdateSocket) => {
          if (data.userid !== arg) {
            return;
          }
          updateCachedData((draft) => {
            draft.pages.forEach(({posts}) => {
               const possibleIndex = posts.findIndex((ele) => ele.id === data.id);
              if (possibleIndex !== -1) {
                if (data.type ===  "content" && data.content) {
                posts[possibleIndex].content = data.content;
                } else if (data.type === "likes" && data.likes !== undefined) {
                  posts[possibleIndex].likesCount = data.likes;
                }
              }
            })
          });
        };
        try {
          await cacheDataLoaded;

          socket.on("post:deleted", deleteListener);
          socket.on("post:created", newListener);
          socket.on("post:updated", updateListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("post:deleted", deleteListener);
          socket.off("post:created", newListener);
          socket.off("post:updated", updateListener);
      },
      providesTags: ["UserPostsInfo"]
    }),
    getFeed: builder.infiniteQuery<{ feed: (FullPostInfo & Likes & YourLike & OwnCommentsCount)[] }, void, InitialPageParam>({
      query: ({pageParam}) => ({
        url: `/users/self/feed${getProperQuery(pageParam)}`,
      }),
      infiniteQueryOptions: {
        initialPageParam: {
          skip: 0,
          amount: 10,
        },
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
        ) => {
          if (lastPage.feed.length === lastPageParam.amount) {
            return {
              skip: lastPageParam.amount + lastPageParam.skip,
              amount: lastPageParam.amount,
            }
          } else {
            return undefined;
          }
        },
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const deleteListener = (data: BasicId) => {
          updateCachedData((draft) => {
            draft.pages.forEach(({feed}) => {
              const possibleIndex = feed.findIndex((ele) => ele.id === data.id);
              if (possibleIndex !== -1) {
                feed.splice(possibleIndex, 1);
              };
            })
          });
        };
        const newListener = (data: NewPostSocket) => {
          updateCachedData((draft) => {
            draft.pages[0].feed.unshift({...data.post, ownCommentsCount:0});
          });
        };
        const updateListener = (data: PostUpdateSocket) => {
          updateCachedData((draft) => {
            draft.pages.forEach(({feed}) => {
              const possibleIndex = feed.findIndex((ele) => ele.id === data.id);
              if (possibleIndex !== -1) {
                if (data.type ===  "content" && data.content) {
                  feed[possibleIndex].content = data.content;
                } else if (data.type === "likes" && data.likes !== undefined) {
                  feed[possibleIndex].likesCount = data.likes;
                };
              };
            })
          });
        };
        try {
          await cacheDataLoaded;

          socket.on("follow:post:deleted", deleteListener);
          socket.on("follow:post:created", newListener);
          socket.on("follow:post:updated", updateListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("follow:post:deleted", deleteListener);
        socket.off("follow:post:created", newListener);
        socket.off("follow:post:updated", updateListener);
      },
      providesTags: ["FeedInfo"],
    }),
    getFollowers: builder.infiniteQuery<{ followers: (UserFollowType & UserExtra)[] }, void, InitialPageParam>({
      query: ({pageParam}) => ({
        url: `/users/self/followers${getProperQuery(pageParam)}`,
      }),
      infiniteQueryOptions: {
        initialPageParam: {
          skip: 0,
          amount: 30,
        },
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
        ) => {
          if (lastPage.followers.length === lastPageParam.amount) {
            return {
              skip: lastPageParam.amount + lastPageParam.skip,
              amount: lastPageParam.amount,
            }
          } else {
            return undefined;
          }
        },
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: FollowersSocket) => {
          updateCachedData((draft) => {
            if (data.action === "REMOVE") {
              draft.pages.forEach(({followers}) => {
                const possibleIndex = followers.findIndex((ele) => ele.id === data.id);
                if (possibleIndex !== -1) {
                  followers.splice(possibleIndex, 1);
                };
              });
            };
          });
        };

        const userListener = (data: UserUpdateSocket) => {
          updateCachedData((draft) => {
            if (data.type === "user" && data.data) {
              draft.pages.forEach(({followers}) => {
                const possibleIndex = followers.findIndex((ele) => ele.id === data.id);
                if (possibleIndex !== -1) {
                  Object.assign(followers[possibleIndex], data.data);
                }
              })
            }
          });
        };

        const followsListener = (data: FollowsSocket) => {
          if (data.action !== "ADD" || !data.data) {
            return;
          }
          updateCachedData((draft) => {
            draft.pages.forEach(({followers}) => {
              const possibleIndex = followers.findIndex((ele) => ele.id === data.data?.id);
              if (possibleIndex !== -1) {
                followers[possibleIndex].followers = [{id: "1"}];
                followers[possibleIndex].receivedRequests = undefined;
              }
            })
          });
        };

        const requestListener = (data: RequestSocketOptions) => {
          if (data.action !== "REMOVE" || !data.data.userid || !data.data.myid) {
            return;
          };

          if (data.data.userid === data.data.myid) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages.forEach(({followers}) => {
              const possibleIndex = followers.findIndex((ele) => ele.id === data.data.userid);
              if (possibleIndex !== -1) {
                followers[possibleIndex].receivedRequests = undefined;
              }
            });
          })
        };
        try {
          await cacheDataLoaded;

          socket.on("followers", listener);
          socket.on("user:updated", userListener);
          socket.on("follows", followsListener);
          socket.on("request", requestListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("followers", listener);
        socket.off("user:updated", userListener);
        socket.off("follows", followsListener);
        socket.off("request", requestListener);
      },
      providesTags: ["FollowersInfo"],
      
    }),
    getFollows: builder.infiniteQuery<{ follows: (UserFollowType & UserExtra)[] }, void, InitialPageParam>({
      query: ({pageParam}) => ({
        url: `/users/self/follows${getProperQuery(pageParam)}`,
      }),
      infiniteQueryOptions: {
        initialPageParam: {
          skip: 0,
          amount: 30,
        },
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
        ) => {
          if (lastPage.follows.length === lastPageParam.amount) {
            return {
              skip: lastPageParam.amount + lastPageParam.skip,
              amount: lastPageParam.amount,
            }
          } else {
            return undefined;
          }
        },
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: FollowsSocket) => {
          if (!data.data) {
            return;
          }
          updateCachedData((draft) => {
            if (data.action === "ADD") {
              draft.pages[0].follows.unshift(data.data as (UserFollowType & UserExtra));
            }
          });
        };
        const userListener = (data: UserUpdateSocket) => {
          updateCachedData((draft) => {
            if (data.type === "user" && data.data) {
              draft.pages.forEach(({follows}) => {
                const possibleIndex = follows.findIndex((ele) => ele.id === data.id);
                if (possibleIndex !== -1) {
                  Object.assign(follows[possibleIndex], data.data);
                }
              })
            }
          });
        };

        try {
          await cacheDataLoaded;

          socket.on("follows", listener);
          socket.on("user:updated", userListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("follows", listener);
        socket.off("user:updated", userListener);
      },
      providesTags: ["FollowsInfo"],
    }),
    stopFollow: builder.mutation<ReturnMessage, UId>({
      query: ({id}) => ({
        url: `/users/${id}/follow`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'UserInfo', id: arg.id }],
      async onQueryStarted({ id }, { dispatch, getState ,queryFulfilled }) {
        try {
          await queryFulfilled;
          const queryArgs = apiSlice.util.selectCachedArgsForQuery(
            getState(),
            "searchUsers"
          );

          queryArgs.forEach((arg) => {
            dispatch(
              apiSlice.util.updateQueryData('searchUsers', arg, (draft) => {
                draft.pages.forEach(({users}) => {
                  const possibleIndex = users.findIndex((ele) => ele.id === id);
                  if (possibleIndex !== -1) {
                    users[possibleIndex].followers = undefined;
                  }
                })
              }),
            );
          });

          dispatch(
            apiSlice.util.updateQueryData('getUsers', undefined, (draft) => {
              draft.pages.forEach(({users}) => {
                  const possibleIndex = users.findIndex((ele) => ele.id === id);
                  if (possibleIndex !== -1) {
                    users[possibleIndex].followers = undefined;
                  }
                })
            }),
          );

          dispatch(
            apiSlice.util.updateQueryData('getFollows', undefined, (draft) => {
              draft.pages.forEach(({follows}) => {
                const possibleIndex = follows.findIndex((ele) => ele.id === id);
                if (possibleIndex !== -1) {
                  follows.splice(possibleIndex, 1);
                }
              })
            }),
          );

          dispatch(
            apiSlice.util.updateQueryData('getFollowers', undefined, (draft) => {
              draft.pages.forEach(({followers}) => {
                const possibleIndex = followers.findIndex((ele) => ele.id === id);
                if (possibleIndex !== -1) {
                  followers[possibleIndex].followers = undefined;
                }
              })
            }),
          );
        } catch {}
      },
    }),
    updateMe: builder.mutation<ReturnMessage, FormData>({
      query: (info) => ({
        url: "/users/self",
        method: "PUT",
        body: info,
      }),
      invalidatesTags: ["SelfInfo"],
    }),
    getIcons: builder.query<{ icons: IconInfo[] }, void>({
      query: () => ({
        url: "/users/icons",
      }),
    }),
    getReceivedRequests: builder.query<{ received: (RequestInfo & ReceivedExtra)[] }, void>({
      query: () => ({
        url: "/requests",
      }),
      providesTags: ["ReceivedInfo"] ,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: RequestSocketOptions) => {
          updateCachedData((draft) => {
            if (data.action === "ADD" && data.data.request) {
              draft.received.unshift(data.data.request);
            } else if (data.action === "REMOVE" && data.data.id && data.data.userid) {
              if (!draft.received[0]) {
                return;
              };
              if (draft.received[0].targetid !== data.data.userid) {
                return;
              };

              const possibleIndex = draft.received.findIndex((ele) =>  ele.id === data.data.id);
              if (possibleIndex !== -1) {
                draft.received.splice(possibleIndex, 1);
              };
            };
          });
        };
        try {
          await cacheDataLoaded;

          socket.on("request", listener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("request", listener);
      },
    }),
    getSentRequests: builder.query<{ sent: (RequestInfo & SentExtra)[] }, void>({
      query: () => ({
        url: "/requests/sent",
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: RequestSocketOptions) => {
          if (data.action === "ADD") {
            return;
          };
          updateCachedData((draft) => {
            if (data.action === "REMOVE" && data.data.id && data.data.userid) {
              if (!draft.sent[0]) {
                return;
              };
              if (draft.sent[0].senderid === data.data.userid) {
                return;
              };

              const possibleIndex = draft.sent.findIndex((ele) =>  ele.id === data.data.id);
              if (possibleIndex !== -1) {
                draft.sent.splice(possibleIndex, 1);
              };
            };
          });
        };
        try {
          await cacheDataLoaded;

          socket.on("request", listener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("request", listener);
      },
      providesTags: ["SentInfo"]
    }),
    makeRequest: builder.mutation<UId, RequestCreate>({
      query: (options) => ({
        url: "/requests",
        method: "POST",
        body: options
      }),
      invalidatesTags: (result, error, arg) => [ "SentInfo",{ type: 'UserInfo', id: arg.id }],
      async onQueryStarted({ id }, { dispatch, getState ,queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const queryArgs = apiSlice.util.selectCachedArgsForQuery(
            getState(),
            "searchUsers"
          );

          queryArgs.forEach((arg) => {
            dispatch(
              apiSlice.util.updateQueryData('searchUsers', arg, (draft) => {
                draft.pages.forEach(({users}) => {
                  const possibleIndex = users.findIndex((ele) => ele.id === id);
                  if (possibleIndex !== -1) {
                    users[possibleIndex].receivedRequests = [{id: data.id}];
                  }
                })
              }),
            );
          });

          dispatch(
            apiSlice.util.updateQueryData('getUsers', undefined, (draft) => {
              draft.pages.forEach(({users}) => {
                  const possibleIndex = users.findIndex((ele) => ele.id === id);
                  if (possibleIndex !== -1) {
                    users[possibleIndex].receivedRequests = [{id: data.id}];
                  }
                })
            }),
          );

          dispatch(
            apiSlice.util.updateQueryData('getFollowers', undefined, (draft) => {
              draft.pages.forEach(({followers}) => {
                  const possibleIndex = followers.findIndex((ele) => ele.id === id);
                  if (possibleIndex !== -1) {
                    followers[possibleIndex].receivedRequests = [{id: data.id}];
                  }
                })
            }),
          );
        } catch {}
      },
    }),
    acceptRequest: builder.mutation<ReturnMessage, UId>({
      query: ({id}) => ({
        url: `/requests/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["ReceivedInfo", "FollowersInfo"],
    }),
    deleteRequest: builder.mutation<ReturnMessage, UId & {type: "CANCEL" | "REJECT"} & {userid: string}>({
      query: ({id}) => ({
        url: `/requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => {
        if (arg.type === "CANCEL") {
          return ["SentInfo", {type: "UserInfo", id: arg.userid}];
        };
        return ["ReceivedInfo"];
      },
      async onQueryStarted({ id, userid, type }, { dispatch, getState ,queryFulfilled }) {
        try {
          await queryFulfilled;
          if (type === "CANCEL") {
            const queryArgs = apiSlice.util.selectCachedArgsForQuery(
            getState(),
            "searchUsers"
            );
            queryArgs.forEach((arg) => {
              dispatch(
                apiSlice.util.updateQueryData('searchUsers', arg, (draft) => {
                  draft.pages.forEach(({users}) => {
                    const possibleIndex = users.findIndex((ele) => ele.id === userid);
                    if (possibleIndex !== -1) {
                      users[possibleIndex].receivedRequests = undefined;
                    }
                  })
                }),
              );
            });
            dispatch(
              apiSlice.util.updateQueryData('getUsers', undefined, (draft) => {
                draft.pages.forEach(({users}) => {
                    const possibleIndex = users.findIndex((ele) => ele.id === userid);
                    if (possibleIndex !== -1) {
                      users[possibleIndex].receivedRequests = undefined;
                    }
                  })
              }),
            );
            dispatch(
            apiSlice.util.updateQueryData('getFollowers', undefined, (draft) => {
              draft.pages.forEach(({followers}) => {
                  const possibleIndex = followers.findIndex((ele) => ele.id === id);
                  if (possibleIndex !== -1) {
                    followers[possibleIndex].receivedRequests = undefined;
                  }
                })
            }),
           );
          }
        } catch {}
      },
    }),
    getPost: builder.query<{ post: FullPostInfo & Likes & YourLike & OwnCommentsCount }, UId>({
      query: ({ id }) => ({
        url: `/posts/${id}`,
      }),
      providesTags: (result, error, arg) => [{type: "PostInfo", id: arg.id}],
       async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: PostUpdateSocket) => {
          if (data.id !== arg.id) {
            return;
          }
          updateCachedData((draft) => {
              if (data.type ===  "content" && data.content) {
              draft.post.content = data.content;
            } else if (data.type === "likes" && data.likes !== undefined) {
              draft.post.likesCount = data.likes;
            }
          });
        };
        const deleteListener = (data: CommentDeleteSocket) => {
          if (data.postid !== arg.id) {
            return;
          };

          if (data.superparentid || data.parentid) {
            return;
          };

          
          updateCachedData((draft) => {
            draft.post.ownCommentsCount -= 1;
          });
          return; 
        };
        const newListener = (data: NewCommentSocket) => {
          if (data.comment.postid !== arg.id) {
            return;
          };

          if (data.superparentid || data.comment.commentid) {
            return;
          };
          
          updateCachedData((draft) => {
            draft.post.ownCommentsCount += 1;
          });
          return;
          
        };
        try {
          await cacheDataLoaded;
          const response = await socket.emitWithAck("post:join", {id: arg.id, comments: "yes"});
          socket.on("post:updated", listener);
          socket.on("comment:deleted", deleteListener);
          socket.on("comment:created", newListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        const response = await socket.emitWithAck("post:leave", {id: arg.id});
        socket.off("post:updated", listener);
        socket.off("comment:deleted", deleteListener);
        socket.off("comment:created", newListener);
      },
    }),
    getMyPosts: builder.infiniteQuery<{ posts: (FullPostInfo & Likes & YourLike & OwnCommentsCount)[] }, string,  InitialPageParam>({
      query: ({pageParam}) => ({
        url: `/posts${getProperQuery(pageParam)}`,
      }),
      infiniteQueryOptions: {
        initialPageParam: {
          skip: 0,
          amount: 30,
        },
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
        ) => {
          if (lastPage.posts.length === lastPageParam.amount) {
            return {
              skip: lastPageParam.amount + lastPageParam.skip,
              amount: lastPageParam.amount,
            }
          } else {
            return undefined;
          }
        },
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const updateListener = (data: PostUpdateSocket) => {
          if (data.userid !== arg) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages.forEach(({posts}) => {
              const possibleIndex = posts.findIndex((ele) => ele.id === data.id);
              if (possibleIndex !== -1) {
                if (data.type ===  "content" && data.content) {
                  posts[possibleIndex].content = data.content;
                } else if (data.type === "likes" && data.likes !==  undefined) {
                  posts[possibleIndex].likesCount = data.likes;
                };
              };
            });
          });
        };
        try {
          await cacheDataLoaded;
          socket.on("post:updated", updateListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        socket.off("post:updated", updateListener);
      },
    }),
    updatePost: builder.mutation<{post: UpdatedPost & Likes & YourLike}, UpdateContent & UId>({
      query: ({ id, content }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: {content},
      }),
      invalidatesTags: (result, error, arg) => [{type:"PostInfo", id: arg.id}],
    }),
    deletePost: builder.mutation<ReturnMessage, UId>({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{type:"PostInfo", id: arg.id}],
    }),
     getComment: builder.query<{ comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike }, UId>({
      query: ({ id }) => ({
        url: `/comments/${id}`,
      }),
      providesTags: (result, error, arg) => [{type: "CommentInfo", id: arg.id}],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: CommentUpdateSocket) => {
          if (data.id !== arg.id) {
            return;
          }
          updateCachedData((draft) => {
              if (data.type === "likes" && data.likes !== undefined) {
                draft.comment.likesCount = data.likes;
              } else if (data.type === "comment" && data.comment) {
                Object.assign(draft.comment, data.comment);
              }
          });
        };
         const deleteListener = (data: CommentDeleteSocket) => {
          if (data.parentid !== arg.id) {
            return;
          };

          updateCachedData((draft) => {
            draft.comment.ownCommentsCount -= 1;
          })
        };
        const newListener = (data: NewCommentSocket) => {
          if (data.comment.commentid !== arg.id) {
            return;
          };

          updateCachedData((draft) => {
            draft.comment.ownCommentsCount += 1;
          })
        };
        let commentData : (FullCommentInfo & Likes & OwnCommentsCount & YourLike) | undefined;
        try {
          const {data: {comment}} = await cacheDataLoaded;
          commentData = comment;
          const response = await socket.emitWithAck("post:join", {id: commentData.postid, comments: "yes"});
          setTimeout(async () => {
            await socket.emitWithAck("post:join", {id: commentData?.postid as string, comments: "yes"});
          }, 1000);
          socket.on("comment:deleted", deleteListener);
          socket.on("comment:created", newListener);
          socket.on("comment:updated", listener);
          
        } catch {}
        
        await cacheEntryRemoved;
        if (commentData) {
          const response = await socket.emitWithAck("post:leave", {id: commentData.postid});
        };
        socket.off("comment:deleted", deleteListener);
        socket.off("comment:created", newListener);
        socket.off("comment:updated", listener);
      },
    }),
    updateComment: builder.mutation<{comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike}, UpdateContent & UId>({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: "PUT",
        body: {content},
      }),
      invalidatesTags: (result, error, arg) => [{type: "CommentInfo", id: arg.id}],
    }),
    deleteComment: builder.mutation<UId & {postid: string, parentid?: string}, UId>({
      query: ({ id }) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
    }),
    createPost: builder.mutation<{ postid: string }, FormData>({
      query: (form) => ({
        url: `/posts`,
        method: "POST",
        body: form
      }),
    }),
    createComment: builder.mutation<{ comment: FullCommentInfo & Likes & OwnCommentsCount }, UId & {info: FormData} & {comment?: string}>({
      query: ({ id, info, comment }) => ({
        url: `/posts/${id}${comment ? `?comment=${comment}` : ""}`,
        method: "POST",
        body: info
      }),
    }),
    changePostLike: builder.mutation<{post: YourLike & UpdatedPost}, UId & LikeTypes>({
      query: ({ id, action }) => ({
        url: `/posts/${id}/likes`,
        method: "PUT",
        body: {
          action
        }
      }),
      invalidatesTags: (result, error, arg) => [{type:"PostInfo", id: arg.id}],
       async onQueryStarted({ id, action }, { dispatch, getState ,queryFulfilled }) {
        try {
          const { data : {post} } = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData('getFeed', undefined, (draft) => {
              draft.pages.forEach(({feed}) => {
                const possibleIndex = feed.findIndex((ele) => ele.id === post.id);
                if (possibleIndex !== -1) {
                  if (action === "ADD") {
                    feed[possibleIndex].likes = [{id:"1"}];
                  } else {
                    feed[possibleIndex].likes = undefined;
                  }
                }
              });
            }),
          );

          dispatch(
            apiSlice.util.updateQueryData('getUserPosts', post.creatorid, (draft) => {
              draft.pages.forEach(({posts}) => {
                const possibleIndex = posts.findIndex((ele) => ele.id === post.id);
                if (possibleIndex !== -1) {
                  if (action === "ADD") {
                    posts[possibleIndex].likes = [{id:"1"}];
                  } else {
                    posts[possibleIndex].likes = undefined;
                  }
                }
              });
            }),
          );

          const queryArgs = apiSlice.util.selectCachedArgsForQuery(
            getState(),
            "getMyPosts"
          );

          queryArgs.forEach((myarg) => {
            dispatch( 
            apiSlice.util.updateQueryData('getMyPosts', myarg, (draft) => {
              draft.pages.forEach(({posts}) => {
                const possibleIndex = posts.findIndex((ele) => ele.id === post.id);
                if (possibleIndex !== -1) {
                  if (action === "ADD") {
                    posts[possibleIndex].likes = [{id:"1"}];
                  } else {
                    posts[possibleIndex].likes = undefined;
                  }
                }
              });
            }),
          );
          });
        } catch {}
      },
    }),
    changeCommentLike: builder.mutation<{comment: CommentInfo & YourLike}, UId & LikeTypes>({
      query: ({ id, action }) => ({
        url: `/comments/${id}/likes`,
        method: "PUT",
        body: {
          action
        }
      }),
      async onQueryStarted({ id, action}, { dispatch, queryFulfilled }) {
        try {
          const { data: {comment} } = await queryFulfilled;
          let patchResult;
          if (comment.commentid) {
              patchResult = dispatch(
                apiSlice.util.updateQueryData('getCommentComments', comment.commentid, (draft) => {
                  draft.pages.forEach(({comments}) => {
                    const possibleIndex = comments.findIndex((ele) => ele.id === comment.id);
                    if (possibleIndex !== -1) {
                      if (action === "ADD") {
                        comments[possibleIndex].likes = [{id:"1"}];
                      } else {
                        comments[possibleIndex].likes = undefined;
                      }
                    }
                  });
                }),
              );
          } else {
            patchResult = dispatch(
              apiSlice.util.updateQueryData('getPostComments', comment.postid, (draft) => {
                  draft.pages.forEach(({comments}) => {
                    const possibleIndex = comments.findIndex((ele) => ele.id === comment.id);
                    if (possibleIndex !== -1) {
                      if (action === "ADD") {
                        comments[possibleIndex].likes = [{id:"1"}];
                      } else {
                        comments[possibleIndex].likes = undefined;
                      }
                    }
                  })
              }),
            )
          }
        } catch {}
      },
      invalidatesTags: (result, error, arg) => [{type:"CommentInfo", id: arg.id}],
    }),
    getCommentComments: builder.infiniteQuery<{ comments: (FullCommentInfo & Likes & OwnCommentsCount & YourLike)[] }, string,  InitialPageParam>({
      query: ({ queryArg, pageParam }) => ({
        url: `/comments/${queryArg}/comments${getProperQuery(pageParam)}`,
      }),
      infiniteQueryOptions: {
        initialPageParam: {
          skip: 0,
          amount: 30,
        },
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
        ) => {
          if (lastPage.comments.length === lastPageParam.amount) {
            return {
              skip: lastPageParam.amount + lastPageParam.skip,
              amount: lastPageParam.amount,
            }
          } else {
            return undefined;
          }
        },
      },
      providesTags: ["CommentsInfo"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const deleteListener = (data: CommentDeleteSocket) => {
          if (data.parentid !== arg && data.superparentid !== arg) {
            return;
          };

          if (data.superparentid === arg && data.parentid) {
            updateCachedData((draft) => {
              draft.pages.forEach(({comments}) => {
                const possibleIndex = comments.findIndex((ele) => ele.id === data.parentid);
                if (possibleIndex !== -1) {
                  comments[possibleIndex].ownCommentsCount -= 1;
                };
              })
            });
          };

          if (data.parentid === arg) {
            updateCachedData((draft) => {
              draft.pages.forEach(({comments}) => {
                const possibleIndex = comments.findIndex((ele) => ele.id === data.id);
                if (possibleIndex !== -1) {
                  comments.splice(possibleIndex, 1);
                };
              })
            });
          };
        };
        const newListener = (data: NewCommentSocket) => {
          if (data.comment.commentid !== arg && data.superparentid !== arg) {
            return;
          };

          if (data.superparentid === arg && data.comment.commentid) {
            updateCachedData((draft) => {
              draft.pages.forEach(({comments}) => {
                const possibleIndex = comments.findIndex((ele) => ele.id === data.comment.commentid);
                if (possibleIndex !== -1) {
                  comments[possibleIndex].ownCommentsCount += 1;
                };
              })
            });
          }
          
          if (data.comment.commentid === arg) {
            updateCachedData((draft) => {
              draft.pages[0].comments.unshift(data.comment);
            });
          };
        };
        const updateListener = (data: CommentUpdateSocket) => {
          if (data.parentid !== arg) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages.forEach(({comments}) => {
              const possibleIndex = comments.findIndex((ele) => ele.id === data.id);
              if (possibleIndex !== -1) {
                if (data.type ===  "comment" && data.comment) {
                  Object.assign(comments[possibleIndex], data.comment);
                } else if (data.type === "likes" && data.likes !== undefined) {
                  comments[possibleIndex].likesCount = data.likes;
                }
              }
            });
          });
        };
        try {
          await cacheDataLoaded;

          socket.on("comment:deleted", deleteListener);
          socket.on("comment:created", newListener);
          socket.on("comment:updated", updateListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("comment:deleted", deleteListener);
        socket.off("comment:created", newListener);
        socket.off("comment:updated", updateListener);
      },
    }),
    getPostComments: builder.infiniteQuery<{ comments: (FullCommentInfo & Likes & OwnCommentsCount & YourLike)[] }, string, InitialPageParam>({
      query: ({ queryArg, pageParam }) => ({
        url: `/posts/${queryArg}/comments${getProperQuery(pageParam)}`,
      }),
      infiniteQueryOptions: {
        initialPageParam: {
          skip: 0,
          amount: 30,
        },
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams,
        ) => {
          if (lastPage.comments.length === lastPageParam.amount) {
            return {
              skip: lastPageParam.amount + lastPageParam.skip,
              amount: lastPageParam.amount,
            }
          } else {
            return undefined;
          }
        },
      },
      providesTags: ["PostCommentsInfo"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const deleteListener = (data: CommentDeleteSocket) => {
          if (data.postid !== arg) {
            return;
          };

          if(!data.superparentid && data.parentid) {
            updateCachedData((draft) => {
              draft.pages.forEach(({comments}) => {
                const possibleIndex = comments.findIndex((ele) => ele.id === data.parentid);
                if (possibleIndex !== -1) {
                  comments[possibleIndex].ownCommentsCount -= 1;
                };
              })
            });
            return;
          };

          if (!data.parentid) {
            updateCachedData((draft) => {
              draft.pages.forEach(({comments}) => {
                const possibleIndex = comments.findIndex((ele) => ele.id === data.id);
                if (possibleIndex !== -1) {
                  comments.splice(possibleIndex, 1);
                };
              })
            });
            return;
          };
        };
        const newListener = (data: NewCommentSocket) => {
          if (data.comment.postid !== arg) {
            return;
          };

          if (!data.superparentid && data.comment.commentid) {
            updateCachedData((draft) => {
              draft.pages.forEach(({comments}) => {
                const possibleIndex = comments.findIndex((ele) =>  ele.id === data.comment.commentid);
                if (possibleIndex !== -1) {
                  comments[possibleIndex].ownCommentsCount += 1;
                }
              })
            });
            return;
          }

          if (!data.comment.commentid) {
            updateCachedData((draft) => {
              draft.pages[0].comments.unshift(data.comment);
            });
            return;
          };
        };
        const updateListener = (data: CommentUpdateSocket) => {
          if (data.parentid || data.postid !== arg) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages.forEach(({comments}) => {
              const possibleIndex = comments.findIndex((ele) => ele.id === data.id);
              if (possibleIndex !== -1) {
                if (data.type ===  "comment" && data.comment) {
                  Object.assign(comments[possibleIndex], data.comment);
                } else if (data.type === "likes" && data.likes !== undefined) {
                  comments[possibleIndex].likesCount = data.likes;
                }
              };
            })
          });
        };
        try {
          await cacheDataLoaded;

          socket.on("comment:deleted", deleteListener);
          socket.on("comment:created", newListener);
          socket.on("comment:updated", updateListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("comment:deleted", deleteListener);
        socket.off("comment:created", newListener);
        socket.off("comment:updated", updateListener);
      },
    }),
    getNotifications: builder.query<{ notifications: NotificationsInfo[] }, UId>({
      query: () => ({
        url: `/notifications`,
      }),
      providesTags: (result = {notifications: []}, error, arg) => [
        "NotificationsInfo",
        ...result.notifications.map(({id}) => ({type: "NotificationInfo", id}) as const)
      ],
       async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: NotificationSocket | BasicId & NotificationSocket) => {
          if ("id" in data  && arg.id === data.id) {
            return;
          };
          updateCachedData((draft) => {
              draft.notifications.unshift(data.notification);
          });
        };
        try {
          await cacheDataLoaded;

          socket.on("extraNotifications", listener);
          socket.on("notification", listener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("extraNotifications", listener);
        socket.off("notification", listener);
      },
    }),
    clearNotification: builder.mutation<ReturnMessage, UId>({
      query: ({id}) => ({
        url: `/notifications/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [{type: "NotificationInfo", id: arg.id}]
    }),
    clearNotifications: builder.mutation<ReturnMessage, void>({
      query: () => ({
        url: `/notifications`,
        method: "DELETE"
      }),
      invalidatesTags: ["NotificationsInfo"]
    }),
    })
});

export const {
  useGetReceivedRequestsQuery,
  useGetSentRequestsQuery,
  useAcceptRequestMutation,
  useDeleteRequestMutation,
  useGetFollowsInfiniteQuery,
  useGetFollowersInfiniteQuery,
  useStopFollowMutation,
  useMakeRequestMutation,
  useGetUsersInfiniteQuery,
  useSearchUsersInfiniteQuery,
  useGetMyPostsInfiniteQuery,
  useGetFeedInfiniteQuery,
  useChangePostLikeMutation,
  useGetUserPostsInfiniteQuery,
  useGetUserQuery,
  useGetPostQuery,
  useGetCommentCommentsInfiniteQuery,
  useGetPostCommentsInfiniteQuery,
  useCreateCommentMutation,
  useCreatePostMutation,
  useUpdateCommentMutation,
  useUpdateMeMutation,
  useLoginUserMutation,
  useCreateUserMutation,
  useLogoutUserMutation,
  useGetIconsQuery,
  useGetSelfQuery,
  useUpdatePostMutation,
  useGetNotificationsQuery,
  useClearNotificationMutation,
  useClearNotificationsMutation,
  useGetCommentQuery,
  useDeleteCommentMutation,
  useDeletePostMutation,
  useChangeCommentLikeMutation,
} = apiSlice;