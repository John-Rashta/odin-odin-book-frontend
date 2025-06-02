import { notificationTypes, requestTypes } from "../util/types";

interface ServerToClientEvents {
    request: (data: RequestSocketOptions) => void,
    notification: (data: NotificationSocket) => void,
    follows: (data: FollowsSocket) => void,
    "user:updated": (data: UserUpdateSocket) => void,
    followers: (data: FollowersSocket) => void,
    "comment:updated": (data: CommentUpdateSocket) => void,
    "comment:deleted": (data: CommentDeleteSocket) => void,
    extraNotifications: (data: BasicId & NotificationSocket) => void,
    "post:created": (data: NewPostSocket ) => void,
    "post:deleted": (data: BasicId) => void,
    "post:updated": (data: PostUpdateSocket) => void,
    "comment:created": (data: NewCommentSocket) => void,
    "user:joined": (data: BasicId) => void,
    "post:joined": (data: BasicId) => void,
};

interface ClientToServerEvents {
    "post:join": (payload: PayloadClient, callback: (res: Response) => void) => void,
    "user:join": (payload: PayloadClient, callback: (res: Response) => void) => void,
};

type Response = Error | Success;

interface Success {
    status: string
};

interface Error {
  error: string;
  errorDetails?: {
    message: string;
    path: Array<string | number>;
    type: string;
  }[];
}

interface BasicId {
    id: string
};

interface PayloadClient {
    id: string,
    comments?: "yes"
}

interface RequestSocketOptions {
    action: "REMOVE" | "ADD",
    data: {
        id?: string,
        userid?: string,
        myid?: string,
        request?: {
            sender: {
        id: string;
        username: string;
            };
        } & {
        id: string;
        type: requestTypes;
        targetid: string;
        senderid: string;
        sentAt: Date;
        }
    }
};

interface NotificationSocket {
    notification: {
        id: string;
        content: string;
        type: notificationTypes;
        createdAt: Date;
        typeid: string | null;
    }
};

interface FollowsSocket  {
    action: "ADD" | "REMOVE",
    data: {
        id: string;
        username: string;
        icon: {
            source: string;
        };
        customIcon: {
            url: string;
        } | null;
    }
};

interface UserUpdateSocket {
    type: "followers" | "user",
    newCount?: number,
    id: string,
    data?: {
        icon: {
        source: string;
        };
        customIcon: {
            url: string;
        } | null;
    } & {
        id: string;
        username: string;
        iconid: number;
        aboutMe: string | null;
        joinedAt: Date;
    }
};

interface FollowersSocket {
    action: "ADD" | "REMOVE",
    id: string,
};

interface CommentUpdateSocket {
    type: "comment" | "likes",
    likes?: number,
    id: string,
    comment?: CommentType,
    postid: string,
    parentid?: string,
};

interface CommentDeleteSocket {
    id: string,
    postid: string,
    parentid?: string,
};

interface PostUpdateSocket {
    type: "content" | "likes",
    id: string,
    likes?: number,
    content?: string,
    userid: string,
};

interface NewCommentSocket {
    id: string,
    comment: CommentType
};

interface NewPostSocket {
    id: string,
    post: PostType
}

interface PostType {
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
    content: string;
    id: string;
    createdAt: Date;
    creatorid: string;
    edited: boolean;
    likesCount: number;
    likes?: {
        id: string
    }[];
}

interface CommentType {
    likesCount: number;
    likes?: {
        id: string
    }[];
    ownCommentsCount: number;
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
    image: {
        url: string;
    } | null;
    id: string;
    content: string;
    postid: string;
    sentAt: Date;
    senderid: string;
    commentid: string | null;
    edited: boolean;
    
}

export {
    ServerToClientEvents,
    ClientToServerEvents,
    Response,
    UserUpdateSocket,
    PostUpdateSocket,
    NewPostSocket,
    BasicId,
    FollowersSocket,
    FollowsSocket,
    NotificationSocket,
    CommentUpdateSocket,
    CommentDeleteSocket,
    NewCommentSocket,
    RequestSocketOptions,
};