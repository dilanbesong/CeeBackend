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
  .get("/friends", isAuth, getMyFriendList)
  .get("/myFriendRequest", isAuth, getMyFriendRequestList)
  .get("/getAllmySentFriendRequest", isAuth, getAllmySentFriendRequest)
  .put("/sendFriendOneRequest", isAuth, sendFriendOneRequest)
  .delete("/deleteOneFriend", isAuth, deleteOneFriend)
  .delete("/deleteAllFriends", isAuth, deleteAllFriends)
  .put("/rejectOneFriendRequest", isAuth, rejectOneFriendRequest)
  .put("/cancelOneSentFriendRequest", isAuth, cancelOneSentFriendRequest)
  .put("/cancelAllSentFriendRequest", isAuth, cancelAllSentFriendRequest)
  .put("/acceptOneFriendRequest", isAuth, acceptOneFriendRequest)


export default router