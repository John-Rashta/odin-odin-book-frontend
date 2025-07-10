import { blueInfo, darkInfo, testComment, testDate, testPost } from "../../../../util/globalTestValues";

const useGetCommentCommentsInfiniteQuery = vi.fn(() => {
    return {
        error: false,
        isLoading: false,
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage: vi.fn,
        commentsData: [
            testComment,
        ]
    }
});

const useGetPostCommentsInfiniteQuery = vi.fn(() => {
    return {
        error: false,
        isLoading: false,
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage: vi.fn,
        commentsData: [
            testComment,
        ]
    }
});

const useGetUserPostsInfiniteQuery = vi.fn(() => {
    return {
        error: false,
        isLoading: false,
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage: vi.fn,
        postsData: [
            testPost,
        ]
    }
})

const useGetFeedInfiniteQuery = vi.fn(() => {
    return {
         error: false,
        isLoading: false,
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage: vi.fn,
        postsData: [
            testPost,
        ]
    }
});

const useGetMyPostsInfiniteQuery = vi.fn(() => {
    return {
         error: false,
        isLoading: false,
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage: vi.fn,
        postsData: [
            testPost,
        ]
    }
});

const useSearchUsersInfiniteQuery = vi.fn(() => {
    return {
        error: false,
        isLoading: false,
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage: vi.fn,
        searchData: [
            {
                id: darkInfo.id,
                iconid: 3,
                username: darkInfo.username,
                aboutMe: "string",
                joinedAt: testDate,
                icon: {
                    id: 3,
                    source: "asfas12",
                },
                customIcon: null,
                followerCount: 1,
                receivedRequests: [],
                followers: [],
            }
        ]
    }
});

const useGetUsersInfiniteQuery = vi.fn(() => {
    return {
        error: false,
        isLoading: false,
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage: vi.fn,
        usersData: [
            {
                id: darkInfo.id,
                iconid: 3,
                username: darkInfo.username,
                aboutMe: "string",
                joinedAt: testDate,
                icon: {
                    id: 3,
                    source: "asfas12",
                },
                customIcon: null,
                followerCount: 1,
                receivedRequests: [],
                followers: [],
            },
        ]
    }
});

const useGetFollowersInfiniteQuery = vi.fn(() => {
    return {
        error: false,
        isLoading: false,
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage: vi.fn,
        followersData: [
            {
                id: blueInfo.id,
                username: blueInfo.username,
                icon: {
                    source: "stringasfas",
                },
                customIcon: null,
                 receivedRequests: [],
                followers: [],
            }
        ]
    }
});

const useGetFollowsInfiniteQuery = vi.fn(() => {
    return {
        error: false,
        isLoading: false,
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage: vi.fn,
        followsData: [
            {
                id: darkInfo.id,
                username: darkInfo.username,
                icon: {
                    source: "stringasfas",
                },
                customIcon: null,
                 receivedRequests: [],
                followers: [],
            }
        ]
    }
});

const useGetCommentQuery = vi.fn(() => {
    return {
        isLoading: false,
        error: false,
        commentData: {
            image: null,
            sender: {
                id: blueInfo.id,
                username: blueInfo.username,
                icon: {
                    source: "asdaf4r42r",
                },
                customIcon: null,
            },
            id: "121321412dsa",
            content: "sky",
            edited: false,
            sentAt: testDate,
            commentid: null,
            postid: "asdfas32",
            senderid: blueInfo.id,
            likesCount: 2,
            ownCommentsCount: 2,
            likes: [],
        }
    }
});

const useGetNotificationsQuery = vi.fn(() => {
    return {
        isLoading: false,
        error: false,
        notificationsData: [
            {
                id: "asdasfsa",
                content: "followsent",
                createdAt: testDate,
                type: "USER",
                typeid: darkInfo.id,
            }
        ]
    }
});

const useGetSelfQuery = vi.fn(() => {
    return {
        isLoading: false,
        error: false,
        data: {
            user: {
                id: darkInfo.id,
                iconid: 2,
                username: darkInfo.username,
                aboutMe: "hello",
                joinedAt: testDate,
                icon: {
                    id: 2,
                    source: "ASFAS",
                },
                customIcon: null,
                followerCount: 2,
            }
        }
    }
});

const useGetIconsQuery = vi.fn(() => {
    return {
        isLoading: false,
        error: false,
        data: {
            icons: [
                {
                    id: 2,
                    source: "dasfas",
                }
            ]
        }
    }
});

  const useGetReceivedRequestsQuery = vi.fn(() => {
    return {
        isLoading: false,
        error: false,
        received: [
            {
                id: "Sas123",
                senderid: blueInfo.id,
                targetid: darkInfo.id,
                sentAt: testDate,
                type: "FOLLOW",
                sender: {
                    id: blueInfo.id,
                    username: blueInfo.username,
                },
            },
        ]
    }
  }
);

const useGetSentRequestsQuery = vi.fn(() => {
    return {
        isLoading: false,
        error: false,
        sent: [
            {
                id: "Sas123",
                senderid: blueInfo.id,
                targetid: darkInfo.id,
                sentAt: testDate,
                type: "FOLLOW",
                target: {
                    id: darkInfo.id,
                    username: darkInfo.username,
                },
            },
        ]
    }
  }
);

const useGetUserQuery = vi.fn(() => {
    return {
        isLoading: false,
        error: false,
        userData: {
            id: darkInfo.id,
            iconid: 3,
            username: darkInfo.username,
            aboutMe: "about",
            joinedAt: testDate,
            icon: {
                id: 3,
                source: "",
            },
            customIcon: null,
            followerCount: 354,
            receivedRequests: [],
            followers: [],
        }
    }
});

const useGetPostQuery = vi.fn(() => {
    return {
        isLoading: false,
        error: false,
        postData: {
            id: "asdasf345",
            content: "Goodnight",
            createdAt: testDate,
            creatorid: blueInfo.id,
            edited: true,
            image: null,
            creator: {
                id: blueInfo.id,
                username: blueInfo.username,
                icon: {
                    source: "asdasf",
                },
                customIcon: null,
            },
            likesCount: 3,
            ownCommentsCount: 4,
            likes: [],
        }
    }
});
const useAcceptRequestMutation = vi.fn(() => {
  return [vi.fn];
});

const useDeleteRequestMutation = vi.fn(() => {
  return [vi.fn];
});

const useStopFollowMutation = vi.fn(() => {
  return [vi.fn];
});

const useMakeRequestMutation = vi.fn(() => {
  return [vi.fn];
});

const useChangePostLikeMutation = vi.fn(() => {
  return [vi.fn];
});

const useCreateCommentMutation = vi.fn(() => {
  return [vi.fn];
});

const useCreatePostMutation = vi.fn(() => {
  return [vi.fn];
});

const useUpdateCommentMutation = vi.fn(() => {
  return [vi.fn];
});

const useUpdateMeMutation = vi.fn(() => {
  return [vi.fn];
});

const useLoginUserMutation = vi.fn(() => {
  return [vi.fn];
});

const useCreateUserMutation = vi.fn(() => {
  return [vi.fn];
});

const useLogoutUserMutation = vi.fn(() => {
  return [vi.fn];
});

const useUpdatePostMutation = vi.fn(() => {
  return [vi.fn];
});

const useClearNotificationMutation = vi.fn(() => {
  return [vi.fn];
});

const useClearNotificationsMutation = vi.fn(() => {
  return [vi.fn];
});

const useDeleteCommentMutation = vi.fn(() => {
  return [vi.fn];
});

const useDeletePostMutation = vi.fn(() => {
  return [vi.fn];
});

const useChangeCommentLikeMutation = vi.fn(() => {
  return [vi.fn];
});

export {
    useAcceptRequestMutation,
    useChangeCommentLikeMutation,
    useChangePostLikeMutation,
    useClearNotificationMutation,
    useClearNotificationsMutation,
    useCreateCommentMutation,
    useCreatePostMutation,
    useCreateUserMutation,
    useDeleteCommentMutation,
    useDeletePostMutation,
    useDeleteRequestMutation,
    useGetCommentCommentsInfiniteQuery,
    useGetCommentQuery,
    useGetFeedInfiniteQuery,
    useGetFollowersInfiniteQuery,
    useGetFollowsInfiniteQuery,
    useGetIconsQuery,
    useGetMyPostsInfiniteQuery,
    useGetNotificationsQuery,
    useGetPostCommentsInfiniteQuery,
    useGetPostQuery,
    useGetReceivedRequestsQuery,
    useGetSelfQuery,
    useGetSentRequestsQuery,
    useGetUserPostsInfiniteQuery,
    useGetUserQuery,
    useGetUsersInfiniteQuery,
    useLoginUserMutation,   
    useLogoutUserMutation,
    useMakeRequestMutation,
    useSearchUsersInfiniteQuery,
    useStopFollowMutation,
    useUpdateCommentMutation,
    useUpdateMeMutation,
    useUpdatePostMutation,
}