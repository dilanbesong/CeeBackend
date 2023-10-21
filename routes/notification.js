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
  .post("/createNotification", createNotification)
  .get("/getNotification/:userId", getNotification)
  .get("/searchNotifications/:searchInput", searchNotifications)
  .put(
    "/deleteOneNotification",
    deleteOneNotification
  )
  .delete("/clearAllNotifications/:userId",  clearAllNotifications);
export default router