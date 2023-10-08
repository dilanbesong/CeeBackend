import express from 'express'
import { isAuth } from '../middlewears/isAuth.js'
import { isGroupAdmin } from '../middlewears/admin.js'
import {
  getMyGroups,
  joinGroup,
  getGroup,
  createGroup,
  getGroupPost,
} from "../controllers/group.js";
const router = express.Router()
 router
   .get("/getGroupPost/:groupId", isAuth, getGroupPost)
   .get("/getMyGroups", isAuth, getMyGroups)
   .get("/getGroup/:groupId", isAuth, getGroup)
   .post("/createGroup", isAuth, isGroupAdmin, createGroup)
   .put("/joinGroup", isAuth, joinGroup);

export default router