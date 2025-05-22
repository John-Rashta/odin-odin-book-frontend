import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AmountOptions } from "../../../util/interfaces";
import { getProperQuery } from "../../../util/helpers";

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

type requestTypes = "FOLLOW";
type notificationsTypes = "USER" | "POST" | "COMMENT" | "REQUEST";

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
  type: notificationsTypes;
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
        "CommentInfo",
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
    }),
    getUser: builder.query<{ user: (UserInfo & UserExtra) }, string>({
      query: (user) => ({
        url: `/users/${user}`,
      }),
    }),
    getUsers: builder.query<{ users: (UserInfo & UserExtra)[] }, AmountOptions>({
      query: (options) => ({
        url: `/users${getProperQuery(options)}`,
      }),
    }),
    getUserPosts: builder.query<{ posts: (FullPostInfo & Likes & YourLike)[] }, UId & {options: AmountOptions}>({
      query: ({id, options}) => ({
        url: `/users/${id}/posts${getProperQuery(options)}`,
      }),
    }),
    getFeed: builder.query<{ feed: (FullPostInfo & Likes & YourLike)[] }, AmountOptions>({
      query: (options) => ({
        url: `/users/self/feed${getProperQuery(options)}`,
      }),
    }),
    getFollowers: builder.query<{ followers: (UserFollowType & UserExtra)[] }, AmountOptions>({
      query: (options) => ({
        url: `/users/self/followers${getProperQuery(options)}`,
      }),
    }),
    getFollows: builder.query<{ follows: (UserFollowType & UserExtra)[] }, AmountOptions>({
      query: (options) => ({
        url: `/users/self/follows${getProperQuery(options)}`,
      }),
    }),
    stopFollow: builder.query<ReturnMessage, UId>({
      query: ({id}) => ({
        url: `/users/${id}/follow`,
        method: "DELETE"
      }),
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
    }),
    makeRequest: builder.query<ReturnMessage, RequestCreate>({
      query: (options) => ({
        url: "/requests",
        method: "POST",
        body: options
      }),
    }),
    acceptRequest: builder.query<ReturnMessage, UId>({
      query: ({id}) => ({
        url: `/requests/${id}`,
        method: "PUT",
      }),
    }),
    deleteRequest: builder.query<ReturnMessage, UId>({
      query: ({id}) => ({
        url: `/requests/${id}`,
        method: "DELETE",
      }),
    }),
    getPost: builder.query<{ post: FullPostInfo & Likes & YourLike }, UId>({
      query: ({ id }) => ({
        url: `/posts/${id}`,
      }),
      providesTags: ["PostInfo"],
    }),
    getMyPosts: builder.query<{ posts: (FullPostInfo & Likes & YourLike)[] }, AmountOptions>({
      query: (options) => ({
        url: `/posts${getProperQuery(options)}`,
      }),
    }),
    updatePost: builder.mutation<{post: UpdatedPost & Likes & YourLike}, UpdateContent & UId>({
      query: ({ id, content }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: content,
      }),
      invalidatesTags: ["PostInfo"],
    }),
    deletePost: builder.mutation<ReturnMessage, UId>({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PostInfo"],
    }),
     getComment: builder.query<{ comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike }, UId>({
      query: ({ id }) => ({
        url: `/comments/${id}`,
      }),
      providesTags: ["CommentInfo"],
    }),
    updateComment: builder.mutation<{comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike}, UpdateContent & UId>({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: "PUT",
        body: content,
      }),
      invalidatesTags: ["CommentInfo"],
    }),
    deleteComment: builder.mutation<ReturnMessage, UId>({
      query: ({ id }) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CommentInfo"],
    }),
    createPost: builder.query<{ postid: string }, FormData>({
      query: (form) => ({
        url: `/posts`,
        method: "POST",
        body: form
      }),
    }),
    createComment: builder.query<{ post: FullPostInfo & Likes }, UId & {info: FormData}>({
      query: ({ id, info }) => ({
        url: `/posts/${id}`,
        method: "POST",
        body: info
      }),
    }),
    changePostLike: builder.query<ReturnMessage, UId & LikeTypes>({
      query: ({ id, action }) => ({
        url: `/posts/${id}/likes`,
        method: "PUT",
        body: {
          action
        }
      }),
    }),
    changeCommentLike: builder.query<ReturnMessage, UId & LikeTypes>({
      query: ({ id, action }) => ({
        url: `/comments/${id}/likes`,
        method: "PUT",
        body: {
          action
        }
      }),
    }),
    getCommentComments: builder.query<{ comments: (FullCommentInfo & Likes & OwnCommentsCount & YourLike)[] }, UId & {options: AmountOptions}>({
      query: ({ id, options }) => ({
        url: `/comments/${id}/comments${getProperQuery(options)}`,
      }),
    }),
    getPostComments: builder.query<{ comments: (FullCommentInfo & Likes & OwnCommentsCount & YourLike)[] }, UId & {options: AmountOptions}>({
      query: ({ id, options }) => ({
        url: `/posts/${id}/comments${getProperQuery(options)}`,
      }),
      providesTags: ["CommentInfo"],
    }),
    getNotifications: builder.query<{ notifications: NotificationsInfo[] }, void>({
      query: () => ({
        url: `/notifications`,
      }),
    }),
    clearNotification: builder.query<ReturnMessage, UId>({
      query: ({id}) => ({
        url: `/notifications/${id}`,
        method: "DELETE"
      }),
    }),
    clearNotifications: builder.query<ReturnMessage, void>({
      query: () => ({
        url: `/notifications`,
        method: "DELETE"
      }),
    }),
    })
});