import express from 'express'
import { isAuth } from "../middlewears/isAuth.js";
import {
  displayChatList,
  pullFriendFromChatlist,
  deleteOneChat,
  saveChat,
  getChats,
  clearChats,
} from "../controllers/chat.js";



const router = express.Router()

router
  .get("/displayChatlist/:myId", isAuth, displayChatList)
  .get("/getChats/:friendId/:myId", isAuth, getChats)
  .put("/removeFriendFromChat", isAuth, pullFriendFromChatlist)
  .post("/saveChat", isAuth, saveChat)
  .put("/deleteOneChat", isAuth, deleteOneChat)
  .put('/clearChats', isAuth, clearChats)

export default router