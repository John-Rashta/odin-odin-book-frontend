import { requestTypes } from "./types";

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
    };
    followers?: {
        id: string;
    };
};

export {
    AmountOptions,
    RequestInfo,
    ReceivedExtra,
    SentExtra,
    UserExtra,
};