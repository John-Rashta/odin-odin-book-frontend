import { notificationTypes, requestTypes } from "./types";

interface AmountOptions  {
  amount?: number;
  skip?: number;
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
};

interface SentExtra {
   target: {
    id: string;
    username: string;
  };
};

interface UserExtra {
    receivedRequests?: {
        id: string;
    }[];
    followers?: {
        id: string;
    }[];
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


interface ReturnMessage {
    message?: string
};

interface PwInfo {
  checkValue: string;
  changeValue: React.Dispatch<React.SetStateAction<string>>;
};

interface NotificationsInfo {
  id: string;
  content: string;
  createdAt: Date;
  type: notificationTypes;
  typeid: string | null;
};

export {
    AmountOptions,
    RequestInfo,
    ReceivedExtra,
    SentExtra,
    UserExtra,
    UserFollowType,
    UserInfo,
    FullPostInfo,
    Likes,
    YourLike,
    OwnCommentsCount,
    FullCommentInfo,
    ReturnMessage,
    PwInfo,
    NotificationsInfo,
};