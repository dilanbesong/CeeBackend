import express from 'express'
import { isAuth } from '../middlewears/isAuth.js'
import { getNotification, deleteOneNotification, clearAllNotifications } from '../controllers/notification.js'
const router = express.Router()

router
  .get("/getNotification", isAuth, getNotification)
  .delete("/deleteOneNotification", isAuth, deleteOneNotification)
  .delete("/clearAllNotifications", isAuth, clearAllNotifications)
export default router