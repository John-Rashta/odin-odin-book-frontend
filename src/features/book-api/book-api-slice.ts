import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AmountOptions } from "../../../util/interfaces";
import { getProperQuery } from "../../../util/helpers";
import { socket } from "../../../sockets/socket";
import { InitialPageParam, notificationTypes, requestTypes } from "../../../util/types";
import { NewPostSocket, PostUpdateSocket, UserUpdateSocket, BasicId, FollowersSocket, FollowsSocket, NotificationSocket, CommentUpdateSocket, CommentDeleteSocket, NewCommentSocket, RequestSocketOptions } from "../../../sockets/socketTypes";

interface ReturnMessage {
    message?: string
};

interface Credentials {
  username: string;
  password: string;
};

interface UId {
    id: string;
};

interface UserInfo {
    id: string;
    iconid: string;
    username: string;
    aboutMe?: string;
    joinedAt: Date;
    icon: {
        id: number;
        source: string;
    };
    customIcon: {
        url: string;
    } | null;
    followerCount: number;
};

interface RequestInfo {
    id: string;
    senderid: string;
    targetid: string;
    sentAt: Date;
    type: requestTypes;
};

interface ReceivedExtra {
  sender: {
    id: string;
    username: string;
  };
}

interface SentExtra {
   target: {
    id: string;
    username: string;
  };
}

interface UserExtra {
    receivedRequests?: {
        id: string;
    };
    followers?: {
        id: string;
    };
};

interface IconInfo {
  id: number;
  source: string;
};

interface FullPostInfo {
  id: string;
  content: string;
  createdAt: Date;
  creatorid: string;
  edited: boolean;
  image: {
      url: string;
  } | null;
  creator: {
      id: string;
      username: string;
      icon: {
          source: string;
      };
      customIcon: {
          url: string;
      } | null;
  };
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

interface FullCommentInfo {
  image: {
      url: string;
  } | null;
  sender: {
      id: string;
      username: string;
      icon: {
          source: string;
      };
      customIcon: {
          url: string;
      } | null;
  };
  id: string;
  content: string;
  edited: boolean;
  sentAt: Date;
  commentid: string | null;
  postid: string;
  senderid: string;
};

interface Likes {
  likesCount: number;
};

interface YourLike {
  likes?: {
    id: string
  }[]
};

interface OwnCommentsCount {
  ownCommentsCount: number;
};

interface LikeTypes {
  action: "ADD" | "REMOVE"
};

interface UserFollowType {
  id: string;
    username: string;
    icon: {
        source: string;
    };
    customIcon: {
        url: string;
    } | null;
};

interface NotificationsInfo {
  id: string;
  content: string;
  createdAt: Date;
  type: notificationTypes;
  typeid: string | null;
};

interface RequestCreate {
  id: string,
  type: requestTypes
}

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000",
        credentials: "include",
    }),
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

        const requestListener = (data: RequestSocketOptions) => {
          if (data.action ===  "REMOVE") {
              if (data.data.userid && (data.data.userid !== data.data.myid)) {
                apiSlice.util.invalidateTags([{type: "UserInfo", id: data.data.userid}]);
              }
            }
        };

        const updateListener = (data: UserUpdateSocket) => {
          if (data.type ===  "user" && data.data) {
            apiSlice.util.invalidateTags([{type: "UserInfo", id: data.data.id}]);
            return;
          };
          return;

        };
        try {
          await cacheDataLoaded;

          socket.on("followers", listener);
          socket.on("request", requestListener);
          socket.on("user:updated", updateListener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("followers", listener);
        socket.off("request", requestListener);
        socket.off("user:updated", updateListener);
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
        url: `/users/search?user=${queryArg}${getProperQuery(pageParam)}`,
      }),
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
            if (data.type ===  "followers" && data.newCount) {
              draft.user.followerCount = data.newCount;
            } else if (data.type === "user" && data.data) {
              Object.assign(draft.user, data.data);
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
      providesTags: (result = {pages: [], pageParams: []}, error, arg) => [
        "UsersInfo",
        ...result.pages.map(({users}) => users.map(({id}) => ({type: "UserInfo", id}) as const)).flat(),
      ],
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
    getUserPosts: builder.infiniteQuery<{ posts: (FullPostInfo & Likes & YourLike)[] }, string, InitialPageParam>({
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
              if (possibleIndex) {
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
            draft.pages[0].posts.unshift(data.post);
          });
        };
        const updateListener = (data: PostUpdateSocket) => {
          if (data.userid !== arg) {
            return;
          }
          updateCachedData((draft) => {
            draft.pages.forEach(({posts}) => {
               const possibleIndex = posts.findIndex((ele) => ele.id === data.id);
              if (possibleIndex) {
                if (data.type ===  "content" && data.content) {
                posts[possibleIndex].content = data.content;
                } else if (data.type === "likes" && data.likes) {
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
    }),
    getFeed: builder.infiniteQuery<{ feed: (FullPostInfo & Likes & YourLike)[] }, void, InitialPageParam>({
      query: ({pageParam}) => ({
        url: `/users/self/feed${getProperQuery(pageParam)}`,
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
              if (possibleIndex) {
                feed.splice(possibleIndex, 1);
              };
            })
          });
        };
        const newListener = (data: NewPostSocket) => {
          updateCachedData((draft) => {
            draft.pages[0].feed.unshift(data.post);
          });
        };
        const updateListener = (data: PostUpdateSocket) => {
          updateCachedData((draft) => {
            draft.pages.forEach(({feed}) => {
              const possibleIndex = feed.findIndex((ele) => ele.id === data.id);
              if (possibleIndex) {
                if (data.type ===  "content" && data.content) {
                  feed[possibleIndex].content = data.content;
                } else if (data.type === "likes" && data.likes) {
                  feed[possibleIndex].likesCount = data.likes;
                };
              };
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
                if (possibleIndex) {
                  followers.splice(possibleIndex, 1);
                };
              });
            };
          });
        };
        try {
          await cacheDataLoaded;

          socket.on("followers", listener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("followers", listener);
      },
      
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
          updateCachedData((draft) => {
            if (data.action === "ADD") {
              draft.pages[0].follows.unshift(data.data);
            }
          });
        };
        try {
          await cacheDataLoaded;

          socket.on("follows", listener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("follows", listener);
      }
    }),
    stopFollow: builder.mutation<ReturnMessage, UId>({
      query: ({id}) => ({
        url: `/users/${id}/follow`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'UserInfo', id: arg.id }],
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
              if (possibleIndex) {
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
              if (possibleIndex) {
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
    makeRequest: builder.mutation<ReturnMessage, RequestCreate>({
      query: (options) => ({
        url: "/requests",
        method: "POST",
        body: options
      }),
      invalidatesTags: (result, error, arg) => [ "SentInfo",{ type: 'UserInfo', id: arg.id }],
    }),
    acceptRequest: builder.mutation<ReturnMessage, UId>({
      query: ({id}) => ({
        url: `/requests/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["ReceivedInfo", "FollowersInfo", "SelfInfo"],
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
        return ["ReceivedInfo", {type: "UserInfo", id: arg.userid}];
      }
    }),
    getPost: builder.query<{ post: FullPostInfo & Likes & YourLike }, UId>({
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
            } else if (data.type === "likes" && data.likes) {
              draft.post.likesCount = data.likes;
            }
          });
        };
        try {
          await cacheDataLoaded;
          socket.on("post:updated", listener);
          
        } catch {}
        
        await cacheEntryRemoved;
        socket.off("post:updated", listener);
      },
    }),
    getMyPosts: builder.infiniteQuery<{ posts: (FullPostInfo & Likes & YourLike)[] }, string,  InitialPageParam>({
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
              if (possibleIndex) {
                if (data.type ===  "content" && data.content) {
                  posts[possibleIndex].content = data.content;
                } else if (data.type === "likes" && data.likes) {
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
        body: content,
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
              if (data.type === "likes" && data.likes) {
                draft.comment.likesCount = data.likes;
              } else if (data.type === "comment" && data.comment) {
                Object.assign(draft.comment, data.comment);
              }
          });
        };
        try {
          await cacheDataLoaded;

          socket.on("comment:updated", listener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("comment:updated", listener);
      },
    }),
    updateComment: builder.mutation<{comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike}, UpdateContent & UId>({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: "PUT",
        body: content,
      }),
      invalidatesTags: (result, error, arg) => [{type: "CommentInfo", id: arg.id}],
    }),
    deleteComment: builder.mutation<UId & {postid: string, parentid?: string}, UId>({
      query: ({ id }) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
       async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: deletedInfo } = await queryFulfilled;
          let patchResult;
          if (deletedInfo.parentid) {
            patchResult = dispatch(
              apiSlice.util.updateQueryData('getCommentComments', deletedInfo.parentid, (draft) => {
                draft.pages.forEach(({comments}) => {
                  const possibleIndex = comments.findIndex((ele) => ele.id === deletedInfo.id);
                  if (possibleIndex) {
                    comments.splice(possibleIndex, 1);
                  };
                });
              }),
            );
          } else {
              patchResult = dispatch(
              apiSlice.util.updateQueryData('getPostComments',deletedInfo.postid, (draft) => {
                draft.pages.forEach(({comments}) => {
                  const possibleIndex = comments.findIndex((ele) => ele.id === deletedInfo.id);
                  if (possibleIndex) {
                    comments.splice(possibleIndex, 1);
                  }
                })
              }),
            )
          }
        } catch {}
      },
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
      async onQueryStarted({ id, comment}, { dispatch, queryFulfilled }) {
        try {
          const { data: newComment } = await queryFulfilled;
          let patchResult;
          if (comment) {
              patchResult = dispatch(
                apiSlice.util.updateQueryData('getCommentComments', comment, (draft) => {
                  draft.pages[0].comments.unshift(newComment.comment)
                }),
              );
          } else {
              patchResult = dispatch(
              apiSlice.util.updateQueryData('getPostComments', id, (draft) => {
                draft.pages[0].comments.unshift(newComment.comment);
              }),
            )
          }
        } catch {}
      },
    }),
    changePostLike: builder.mutation<ReturnMessage, UId & LikeTypes>({
      query: ({ id, action }) => ({
        url: `/posts/${id}/likes`,
        method: "PUT",
        body: {
          action
        }
      }),
      invalidatesTags: (result, error, arg) => [{type:"PostInfo", id: arg.id}],
    }),
    changeCommentLike: builder.mutation<ReturnMessage, UId & LikeTypes>({
      query: ({ id, action }) => ({
        url: `/comments/${id}/likes`,
        method: "PUT",
        body: {
          action
        }
      }),
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
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const deleteListener = (data: CommentDeleteSocket) => {
          if (data.parentid !== arg) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages.forEach(({comments}) => {
              const possibleIndex = comments.findIndex((ele) => ele.id === data.id);
              if (possibleIndex) {
                comments.splice(possibleIndex, 1);
              };
            })
          });
        };
        const newListener = (data: NewCommentSocket) => {
          if (data.comment.commentid !== arg) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages[0].comments.unshift(data.comment);
          });
        };
        const updateListener = (data: CommentUpdateSocket) => {
          if (data.parentid !== arg) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages.forEach(({comments}) => {
              const possibleIndex = comments.findIndex((ele) => ele.id === data.id);
              if (possibleIndex) {
                if (data.type ===  "comment" && data.comment) {
                  Object.assign(comments[possibleIndex], data.comment);
                } else if (data.type === "likes" && data.likes) {
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
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const deleteListener = (data: CommentDeleteSocket) => {
          if (data.parentid || data.postid !== arg) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages.forEach(({comments}) => {
              const possibleIndex = comments.findIndex((ele) => ele.id === data.id);
              if (possibleIndex) {
                comments.splice(possibleIndex, 1);
              };
            })
          });
        };
        const newListener = (data: NewCommentSocket) => {
          if (data.comment.commentid || data.comment.postid !== arg) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages[0].comments.unshift(data.comment);
          });
        };
        const updateListener = (data: CommentUpdateSocket) => {
          if (data.parentid || data.postid !== arg) {
            return;
          };
          updateCachedData((draft) => {
            draft.pages.forEach(({comments}) => {
              const possibleIndex = comments.findIndex((ele) => ele.id === data.id);
              if (possibleIndex) {
                if (data.type ===  "comment" && data.comment) {
                  Object.assign(comments[possibleIndex], data.comment);
                } else if (data.type === "likes" && data.likes) {
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
    getNotifications: builder.query<{ notifications: NotificationsInfo[] }, void>({
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