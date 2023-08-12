import { model, Schema } from "mongoose";


const userSchema = new Schema(
  {
    username: String,
    password: String,
    profileImage: String,
    PhoneNumber: String,
    YearOfEntry: { type: String, default: "adminYear" },
    regNumber: { type: String, default: "adminRegNumber" },
    location: {
      type: String,
      default: "{ log:'', lat:''}",
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
    vistorsList: [],
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
    postStatus: { type: String, default: "public" },
    views: { type: Number, default: 0 },
    category:{ type:String, default:'all'},
    postFiles: [],
    Likes: [],
    Comments: [],
  },
  { timestamps: {} }
);

const commentSchema = new Schema(
  {
    commenterorId: String,
    body: String,
    Likes: [],
    Replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: {} }
);

const groupSchema = new Schema(
  {
    groupName: String,
    groupDescription: String,
    groupProfile: String,
    groupcreator:{ type:String, default:'CEE'},
    groupVisibility: {
      type: Boolean,
      default: true,
    },
    isApprovedByAdminToJoin: {
      type: Boolean,
      default: false,
    },
    GroupAdmins: [],
    vistorsList: [],
    groupPost: [],
    groupMembers: [],
    ChatList:[],
    groupRequestList: [],
  },
  { timestamps: {} }
);

const paymentSchema = new Schema({
   amount:String,
   regNumber:String,
   refNumber:String,
   level:String,
}, { timestamps: {} });

const notificationSchema = new Schema(
  {
    message: String,
    notificatorId:String
  },
  { timestamps: {} }
);
const messageSchema = new Schema({
  message:String,
  messagersId:String
}, { timestamps: {} });

const User = model('User', userSchema)
const Group = model('Group', groupSchema)
const Post = model('Post', postSchema)
const Payment = model('Payment', paymentSchema)
const Notification = model('Notification', notificationSchema)
const Message = model('Message', messageSchema)
const Comment =model('Comment', commentSchema)
export { User, Group, Post, Payment, Notification, Message, Comment }