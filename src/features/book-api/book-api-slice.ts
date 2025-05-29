import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AmountOptions } from "../../../util/interfaces";
import { getProperQuery } from "../../../util/helpers";
import { socket } from "../../../sockets/socket";
import { notificationTypes, requestTypes } from "../../../util/types";
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
        try {
          await cacheDataLoaded;

          socket.on("followers", listener);
          
        } catch {}
        
        await cacheEntryRemoved;
        
        socket.off("followers", listener);
      },
    }),
    searchUsers: builder.query<{ users: (UserInfo & UserExtra)[] }, {user: string, options: AmountOptions}>({
      query: ({user, options}) => ({
        url: `/users/search?user=${user}${getProperQuery(options)}`,
      }),
      providesTags: (result = {users: []}, error, arg) => [
        "SearchInfo",
        ...result.users.map(({id}) => ({type: "UserInfo", id}) as const)
      ],
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {
        const { user } = queryArgs;

        return { user }
      },
      merge: (currentCache, newItems, {arg}) => {
        if (currentCache.users.length === arg.options.skip) {
          currentCache.users.push(...newItems.users);
        }
      },
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
      },
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
    getUserPosts: builder.query<{ posts: (FullPostInfo & Likes & YourLike)[] }, UId & {options: AmountOptions}>({
      query: ({id, options}) => ({
        url: `/users/${id}/posts${getProperQuery(options)}`,
      }),
      providesTags: (result = { posts:[] }, error, arg) => [
        {type: "UserPostsInfo", id: arg.id},
        ...result.posts.map(({id}) => ({type:"PostInfo", id}) as const)
      ],
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {
        const { id } = queryArgs;

        return { id }
      },
      merge: (currentCache, newItems, {arg}) => {
        if (currentCache.posts.length === arg.options.skip) {
          currentCache.posts.push(...newItems.posts);
        }
      },
       async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const deleteListener = (data: BasicId) => {
          updateCachedData((draft) => {
            const possibleIndex = draft.posts.findIndex((ele) => ele.id === data.id);
            if (possibleIndex) {
              draft.posts.splice(possibleIndex, 1);
            }
          });
        };
        const newListener = (data: NewPostSocket) => {
          if (data.id !== arg.id) {
            return;
          };
          updateCachedData((draft) => {
            draft.posts.unshift(data.post);
          });
        };
        const updateListener = (data: PostUpdateSocket) => {
          if (data.userid !== arg.id) {
            return;
          }
          updateCachedData((draft) => {
            const possibleIndex = draft.posts.findIndex((ele) => ele.id === data.id);
            if (possibleIndex) {
              if (data.type ===  "content" && data.content) {
              draft.posts[possibleIndex].content = data.content;
            } else if (data.type === "likes" && data.likes) {
              draft.posts[possibleIndex].likesCount = data.likes;
            }
          }});
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
    getFeed: builder.query<{ feed: (FullPostInfo & Likes & YourLike)[] }, AmountOptions>({
      query: (options) => ({
        url: `/users/self/feed${getProperQuery(options)}`,
      }),
      providesTags: (result  = {feed: []}, error, arg) => [
        "FeedInfo",
        ...result.feed.map(({id})=> ({type:"PostInfo", id}) as const)
      ],
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {

        return endpointName
      },
      merge: (currentCache, newItems, {arg}) => {
        if (currentCache.feed.length === arg.skip) {
          currentCache.feed.push(...newItems.feed);
        }
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const deleteListener = (data: BasicId) => {
          updateCachedData((draft) => {
            const possibleIndex = draft.feed.findIndex((ele) => ele.id === data.id);
            if (possibleIndex) {
              draft.feed.splice(possibleIndex, 1);
            }
          });
        };
        const newListener = (data: NewPostSocket) => {
          updateCachedData((draft) => {
            draft.feed.unshift(data.post);
          });
        };
        const updateListener = (data: PostUpdateSocket) => {
          updateCachedData((draft) => {
            const possibleIndex = draft.feed.findIndex((ele) => ele.id === data.id);
            if (possibleIndex) {
              if (data.type ===  "content" && data.content) {
              draft.feed[possibleIndex].content = data.content;
            } else if (data.type === "likes" && data.likes) {
              draft.feed[possibleIndex].likesCount = data.likes;
            }
          }});
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
    getFollowers: builder.query<{ followers: (UserFollowType & UserExtra)[] }, AmountOptions>({
      query: (options) => ({
        url: `/users/self/followers${getProperQuery(options)}`,
      }),
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {

        return endpointName
      },
      merge: (currentCache, newItems, {arg}) => {
        if (currentCache.followers.length === arg.skip) {
          currentCache.followers.push(...newItems.followers);
        }
      },
      providesTags: ["FollowersInfo"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: FollowersSocket) => {
          updateCachedData((draft) => {
            if (data.action === "REMOVE") {
            const possibleIndex = draft.followers.findIndex((ele) => ele.id === data.id);
            if (possibleIndex) {
              draft.followers.splice(possibleIndex, 1);
            };
          }
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
    getFollows: builder.query<{ follows: (UserFollowType & UserExtra)[] }, AmountOptions>({
      query: (options) => ({
        url: `/users/self/follows${getProperQuery(options)}`,
      }),
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {

        return endpointName
      },
      merge: (currentCache, newItems, {arg}) => {
        if (currentCache.follows.length === arg.skip) {
          currentCache.follows.push(...newItems.follows);
        }
      },
      providesTags: ["FollowsInfo"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const listener = (data: FollowsSocket) => {
          updateCachedData((draft) => {
            if (data.action === "ADD") {
              draft.follows.unshift(data.data);
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
        async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getFollows', {}, (draft) => {
            const possibleIndex = draft.follows.findIndex((ele) => ele.id === id);
            if (possibleIndex) {
              draft.follows.splice(possibleIndex, 1);
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()

          /**
           * Alternatively, on failure you can invalidate the corresponding cache tags
           * to trigger a re-fetch:
           * dispatch(api.util.invalidateTags(['Post']))
           */
        }
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
      invalidatesTags: ["SentInfo"]
    }),
    acceptRequest: builder.mutation<ReturnMessage, UId>({
      query: ({id}) => ({
        url: `/requests/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["ReceivedInfo", "FollowersInfo", "SelfInfo"],
    }),
    deleteRequest: builder.mutation<ReturnMessage, UId & {type: "CANCEL" | "REJECT"}>({
      query: ({id}) => ({
        url: `/requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => {
        if (arg.type === "CANCEL") {
          return ["SentInfo"];
        };
        return ["ReceivedInfo"];
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
    getMyPosts: builder.query<{ posts: (FullPostInfo & Likes & YourLike)[] }, {options: AmountOptions, id: string}>({
      query: ({options}) => ({
        url: `/posts${getProperQuery(options)}`,
      }),
      providesTags: (result= {posts: []}, error, arg) => [
        "PostsInfo",
        ...result.posts.map(({id}) => ({type: "PostInfo", id}) as const)
      ],
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {

        return endpointName
      },
      merge: (currentCache, newItems, {arg}) => {
        if (currentCache.posts.length === arg.options.skip) {
          currentCache.posts.push(...newItems.posts);
        }
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const updateListener = (data: PostUpdateSocket) => {
          if (data.userid !== arg.id) {
            return;
          };
          updateCachedData((draft) => {
            const possibleIndex = draft.posts.findIndex((ele) => ele.id === data.id);
            if (possibleIndex) {
              if (data.type ===  "content" && data.content) {
              draft.posts[possibleIndex].content = data.content;
            } else if (data.type === "likes" && data.likes) {
              draft.posts[possibleIndex].likesCount = data.likes;
            }
          }});
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
                apiSlice.util.updateQueryData('getCommentComments', {id: deletedInfo.parentid, options: {}}, (draft) => {
                  const possibleIndex = draft.comments.findIndex((ele) => ele.id === deletedInfo.id);
                  if (possibleIndex) {
                    draft.comments.splice(possibleIndex, 1);
                  }
                }),
              )
          } else {
              patchResult = dispatch(
              apiSlice.util.updateQueryData('getPostComments', {id: deletedInfo.postid , options: {}}, (draft) => {
                const possibleIndex = draft.comments.findIndex((ele) => ele.id === deletedInfo.id);
                draft.comments.splice(possibleIndex, 1);
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
              apiSlice.util.updateQueryData('getCommentComments', {id: comment, options: {}}, (draft) => {
                draft.comments.unshift(newComment.comment)
              }),
            )
          } else {
              patchResult = dispatch(
              apiSlice.util.updateQueryData('getPostComments', {id, options: {}}, (draft) => {
                draft.comments.unshift(newComment.comment)
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
    getCommentComments: builder.query<{ comments: (FullCommentInfo & Likes & OwnCommentsCount & YourLike)[] }, UId & {options: AmountOptions}>({
      query: ({ id, options }) => ({
        url: `/comments/${id}/comments${getProperQuery(options)}`,
      }),
      providesTags: (result = {comments: []}, error, arg) => [
        {type: "CommentsInfo", id: arg.id},
        ...result.comments.map(({id}) => ({type: "CommentInfo", id}) as const)
      ],
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {
        const { id } = queryArgs;

        return { id }
      },
      merge: (currentCache, newItems, {arg}) => {
        if (currentCache.comments.length === arg.options.skip) {
          currentCache.comments.push(...newItems.comments);
        }
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const deleteListener = (data: CommentDeleteSocket) => {
          if (data.parentid !== arg.id) {
            return;
          };
          updateCachedData((draft) => {
            const possibleIndex = draft.comments.findIndex((ele) => ele.id === data.id);
            if (possibleIndex) {
              draft.comments.splice(possibleIndex, 1);
            }
          });
        };
        const newListener = (data: NewCommentSocket) => {
          if (data.comment.commentid !== arg.id) {
            return;
          };
          updateCachedData((draft) => {
            draft.comments.unshift(data.comment);
          });
        };
        const updateListener = (data: CommentUpdateSocket) => {
          if (data.parentid !== arg.id) {
            return;
          };
          updateCachedData((draft) => {
            const possibleIndex = draft.comments.findIndex((ele) => ele.id === data.id);
            if (possibleIndex) {
              if (data.type ===  "comment" && data.comment) {
                Object.assign(draft.comments[possibleIndex], data.comment);
            } else if (data.type === "likes" && data.likes) {
              draft.comments[possibleIndex].likesCount = data.likes;
            }
          }});
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
    getPostComments: builder.query<{ comments: (FullCommentInfo & Likes & OwnCommentsCount & YourLike)[] }, UId & {options: AmountOptions}>({
      query: ({ id, options }) => ({
        url: `/posts/${id}/comments${getProperQuery(options)}`,
      }),
      providesTags: (result = {comments: []}, error, arg) => [
        {type: "PostCommentsInfo", id: arg.id},
        ...result.comments.map(({id}) => ({type: "CommentInfo", id}) as const)
      ],
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {
        const { id } = queryArgs;

        return { id }
      },
      merge: (currentCache, newItems, {arg}) => {
        if (currentCache.comments.length === arg.options.skip) {
          currentCache.comments.push(...newItems.comments);
        }
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const deleteListener = (data: CommentDeleteSocket) => {
          if (data.parentid) {
            return;
          };
          updateCachedData((draft) => {
            const possibleIndex = draft.comments.findIndex((ele) => ele.id === data.id);
            if (possibleIndex) {
              draft.comments.splice(possibleIndex, 1);
            }
          });
        };
        const newListener = (data: NewCommentSocket) => {
          if (data.comment.commentid) {
            return;
          };
          updateCachedData((draft) => {
            draft.comments.unshift(data.comment);
          });
        };
        const updateListener = (data: CommentUpdateSocket) => {
          if (data.parentid) {
            return;
          };
          updateCachedData((draft) => {
            const possibleIndex = draft.comments.findIndex((ele) => ele.id === data.id);
            if (possibleIndex) {
              if (data.type ===  "comment" && data.comment) {
                Object.assign(draft.comments[possibleIndex], data.comment);
            } else if (data.type === "likes" && data.likes) {
              draft.comments[possibleIndex].likesCount = data.likes;
            }
          }});
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