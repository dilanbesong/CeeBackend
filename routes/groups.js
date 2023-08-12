import express from 'express'
import { isAuth } from '../middlewears/isAuth.js'
import { getMyGroups, leaveOneGroup, joinGroup } from '../controllers/group.js'
const router = express.Router()
 router
   .get("/getMyGroups", isAuth, getMyGroups)
   .put("/leaveOneGroup", isAuth, leaveOneGroup)
   .put("/joinGroup", isAuth, joinGroup);

export default router