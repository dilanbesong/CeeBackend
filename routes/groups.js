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
   .get("/getGroupPost/:groupId", getGroupPost)
   .get("/getMyGroups", getMyGroups)
   .get("/getGroup/:groupId", getGroup)
   .post("/createGroup", isGroupAdmin, createGroup)
   .put("/joinGroup", joinGroup);

export default router