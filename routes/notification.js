import express from 'express'
import { isAuth } from '../middlewears/isAuth.js'
import {
  getNotification,
  deleteOneNotification,
  clearAllNotifications,
  searchNotifications,
  createNotification,
} from "../controllers/notification.js";
const router = express.Router()

router
  .post("/createNotification", isAuth, createNotification)
  .get("/getNotification/:userId", isAuth, getNotification)
  .get("/searchNotifications/:searchInput", isAuth, searchNotifications)
  .put(
    "/deleteOneNotification",
    isAuth,
    deleteOneNotification
  )
  .delete("/clearAllNotifications/:userId", isAuth, clearAllNotifications);
export default router