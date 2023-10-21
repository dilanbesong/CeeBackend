import express from 'express'
import { isAuth } from '../middlewears/isAuth.js'
import {
  getMyFriendList,
  getMyFriendRequestList,
  deleteOneFriend,
  sendFriendOneRequest,
  rejectOneFriendRequest,
  deleteAllFriends,
  cancelOneSentFriendRequest,
  cancelAllSentFriendRequest,
  getAllmySentFriendRequest,
  acceptOneFriendRequest,
} from "../controllers/friends.js";

const router = express.Router()

router
  .get("/friends/:userId", getMyFriendList)
  .get("/myFriendRequest/:myId", getMyFriendRequestList)
  .get("/getAllmySentFriendRequest/:myId", getAllmySentFriendRequest)
  .put("/sendFriendOneRequest", sendFriendOneRequest)
  .delete("/deleteOneFriend/:friendId", deleteOneFriend)
  .delete("/deleteAllFriends", deleteAllFriends)
  .put("/rejectOneFriendRequest", rejectOneFriendRequest)
  .put("/cancelOneSentFriendRequest", cancelOneSentFriendRequest)
  .put("/cancelAllSentFriendRequest", cancelAllSentFriendRequest)
  .put("/acceptOneFriendRequest",  acceptOneFriendRequest)


export default router