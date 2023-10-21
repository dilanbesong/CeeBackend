import express from 'express'
import { isAuth } from "../middlewears/isAuth.js";
import {
  displayChatList,
  pullFriendFromChatlist,
  deleteOneChat,
  saveChat,
  getChats,
  clearChats,
  getLastChat,
} from "../controllers/chat.js";



const router = express.Router()

router
  .get("/displayChatlist/:myId", displayChatList)
  .get("/getChats/:friendId/:myId", getChats)
  .get("/getLastChat/:friendId/:myId", getLastChat)
  .put("/removeFriendFromChat", pullFriendFromChatlist)
  .post("/saveChat", saveChat)
  .put("/deleteOneChat", deleteOneChat)
  .put("/clearChats", clearChats);

export default router