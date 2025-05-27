import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AmountOptions } from "../../../util/interfaces";
import { getProperQuery } from "../../../util/helpers";
import { socket } from "../../../sockets/socket";
import { notificationTypes, requestTypes } from "../../../util/types";
import { UserUpdateSocket } from "../../../sockets/socketTypes";

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
          if (data.id === arg) {
              updateCachedData((draft) => {
                if (data.type ===  "followers" && data.newCount) {
                  draft.user.followerCount = data.newCount;
                } else if (data.type === "user" && data.data) {
                  Object.assign(draft.user, data.data);
                }
              })
          }
        };
        try {
          await cacheDataLoaded;

          socket.on("user:updated", listener);
          
        } catch {}
        
        await cacheEntryRemoved
      
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
    }),
    getSentRequests: builder.query<{ sent: (RequestInfo & SentExtra)[] }, void>({
      query: () => ({
        url: "/requests/sent",
      }),
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
      invalidatesTags: ["ReceivedInfo", "FollowersInfo"],
    }),
    deleteRequest: builder.mutation<ReturnMessage, UId>({
      query: ({id}) => ({
        url: `/requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ReceivedInfo", "SentInfo"]
    }),
    getPost: builder.query<{ post: FullPostInfo & Likes & YourLike }, UId>({
      query: ({ id }) => ({
        url: `/posts/${id}`,
      }),
      providesTags: (result, error, arg) => [{type: "PostInfo", id: arg.id}],
    }),
    getMyPosts: builder.query<{ posts: (FullPostInfo & Likes & YourLike)[] }, AmountOptions>({
      query: (options) => ({
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
        if (currentCache.posts.length === arg.skip) {
          currentCache.posts.push(...newItems.posts);
        }
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
    }),
    getNotifications: builder.query<{ notifications: NotificationsInfo[] }, void>({
      query: () => ({
        url: `/notifications`,
      }),
      providesTags: (result = {notifications: []}, error, arg) => [
        "NotificationsInfo",
        ...result.notifications.map(({id}) => ({type: "NotificationInfo", id}) as const)
      ]
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