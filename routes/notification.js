import express from 'express'
import { isAuth } from '../middlewears/isAuth.js'
import {
  getNotification,
  deleteOneNotification,
  clearAllNotifications,
  searchNotifications,
} from "../controllers/notification.js";
const router = express.Router()

router
  .get("/getNotification", isAuth, getNotification)
  .get("/searchNotifications/:searchInput", isAuth, searchNotifications)
  .delete(
    "/deleteOneNotification/:notificationId",
    isAuth,
    deleteOneNotification
  )
  .delete("/clearAllNotifications", isAuth, clearAllNotifications);
export default router