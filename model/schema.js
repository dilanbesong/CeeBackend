import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: String,
    password: String,
    PhoneNumber: String,
    YearOfEntry: String,
    regNumber: String,
    profileImage: {
      default:
        "https://tse3.mm.bing.net/th?id=OIP.ruat7whad9-kcI8_1KH_tQHaGI&pid=Api&P=0&h=220",
      type: String,
    },
    backgroundProfile: {
      default:
        "https://tse3.mm.bing.net/th?id=OIP.TmFdrhMS6gzhI-ACF3977wHaF2&pid=Api&P=0&h=220",
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    canViewPanel: {
      type: Boolean,
      default: false,
    },
    email: {
      unique: true,
      require: true,
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    Sex: {
      type: String,
      default: "male",
    },
    ModeOfEntry: {
      type: String,
      default: "UTME",
    },
    level: {
      type: Number,
      default: 100,
    },

    DepartmentalFees: [],
    Posts: [],
    SearchList: [],
    FriendRequestList: [],
    NotificationList: [],
    GroupList: [],
    FriendList: [],
    SentFriendRequestList: [],
    SentGroupRequestList: [],
    ChatList: [],
  },
  { timestamps: {} }
);

const postSchema = new Schema(
  {
    body: { type: String, default: "" },
    postType: { type: String, default: "post" }, // post, status
    poster: { type: String, default: "CEE" },
    views: { type: Number, default: 0 },
    category: { type: String, default: "all" },
    fileList: [],
    Likes: [],
    Comments: [],
  },
  { timestamps: {} }
);

const commentSchema = new Schema(
  {
    commentorId: String,
    body: String,
    Likes: [],
    Replies: [],
  },
  { timestamps: {} }
);

const groupSchema = new Schema(
  {
    groupName: String,
    groupDescription: String,
    groupProfile: {
      type: String,
      default:
        "https://tse1.mm.bing.net/th?id=OIP.QxsVsurnuz5IpPrRtTqJGwHaHa&pid=Api&P=0&h=220",
    },
    isBlocked: { type: Boolean, default: false },
    groupcreator: { type: String, default: "CEE" },
    groupBackgroundProfile: {
      type: String,
      default:
        "https://tse1.explicit.bing.net/th?id=OIP.O4T614rCJAnj7fwRGKTkrAAAAA&pid=Api&P=0&h=220",
    },
    groupVisibility: {
      type: Boolean,
      default: true,
    },
    isApprovedByAdminToJoin: {
      type: Boolean,
      default: false,
    },
    GroupAdmins: [],
    groupPost: [],
    groupMembers: [],
    ChatList: [],
    groupRequestList: [],
  },
  { timestamps: {} }
);

const paymentSchema = new Schema(
  {
    amount: String,
    regNumber: String,
    refNumber: Schema.Types.Mixed,
    level: String,
    Year:{ type:String, default:new Date().getFullYear().toString() }
  },
  { timestamps: {} }
);

const notificationSchema = new Schema(
  {
    message: String,
    notificatorId: String,
    redirectUrl:String,
    isView:{ type:Boolean, default:false },
    createdAt: { type: Date, default: new Date() }
  },
);
const messageSchema = new Schema(
  {
    message: String,
    senderId:String,
    recieverId:String,
    timeStamps: {type: Date, default:new Date()}
  },
);

const chatListSchema = new Schema( {
  friendId:String,
  myId:String,
  Chats:[]
})

const User = model("User", userSchema);
const Group = model("Group", groupSchema);
const Post = model("Post", postSchema);
const Payment = model("Payment", paymentSchema);
const Notification = model("Notification", notificationSchema);
const Message = model("Message", messageSchema);
const Comment = model("Comment", commentSchema);
const Chat = model('Chat', chatListSchema)
export { User, Group, Post, Payment, Notification, Message, Comment, Chat };
