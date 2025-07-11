const darkInfo = {
  username: "darkmagician",
  id: "darkgician90",
};

const blueInfo = {
  username: "blueeyes",
  id: "broke58",
};

const testDate = "2015-12-17T03:24:00";

const testPost = {
  id: "asdfa12",
  content: "mypost",
  createdAt: testDate,
  creatorid: darkInfo.id,
  edited: true,
  image: null,
  creator: {
    id: darkInfo.id,
    username: darkInfo.username,
    icon: {
      source: "SAD12",
    },
    customIcon: null,
  },
  likesCount: 1,
  ownCommentsCount: 2,
  likes: [],
};

const testComment = {
  image: null,
  sender: {
    id: blueInfo.id,
    username: blueInfo.username,
    icon: {
      source: "saddsa",
    },
    customIcon: null,
  },
  id: "asdasdaf41",
  content: "mycomment",
  edited: true,
  sentAt: testDate,
  commentid: null,
  postid: "stringdasad",
  senderid: blueInfo.id,
  likesCount: 3,
  ownCommentsCount: 5,
  likes: [],
};

export { testComment, testPost, testDate, darkInfo, blueInfo };
