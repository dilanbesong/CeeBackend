import express from 'express'
import { isGroupAdmin } from '../middlewears/admin.js';
import {
  createGroup,
  editGroup,
  deleteGroup,
  deleteOneMember,
  deleteAllMembers,
  getAllGroupMembers,
  getGroupRequestList,
  deleteOneGroupRequest,
  deleteAllGroupRequest,
  acceptOneNewMember,
} from "../controllers/admin/adminGroup.js";
import { isAuth } from '../middlewears/isAuth.js';

const router = express.Router()

router
  .post("/createGroup", isAuth, isGroupAdmin, createGroup)
  .get("/getALLGroupMembers", isAuth, isGroupAdmin, getAllGroupMembers)
  .get("/getGroupRequestList", isAuth, isGroupAdmin, getGroupRequestList)
  .put("/editGroup", isAuth, isGroupAdmin, editGroup)
  .put("/acceptOneNewMember", isAuth, isGroupAdmin, acceptOneNewMember)
  .delete("deleteGroup", isAuth, isGroupAdmin, deleteGroup)
  .delete("/deleteOneMember", isAuth, isGroupAdmin, deleteOneMember)
  .delete("/deleteALLMembers", isAuth, isGroupAdmin, deleteAllMembers)
  .delete("/deleteOneGroupRequest", isAuth, isGroupAdmin, deleteOneGroupRequest)
  .delete("/deleteAllGroupRequest", isAuth, isGroupAdmin, deleteAllGroupRequest)


export default router