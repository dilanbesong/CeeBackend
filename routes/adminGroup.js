import express from 'express'
import { isGroupAdmin } from '../middlewears/admin.js';
import {
  editGroup,
  deleteGroup,
  deleteOneMember,
  deleteAllMembers,
  getAllGroupMembers,
  deleteOneGroupRequest,
} from "../controllers/admin/adminGroup.js";
import { isAuth } from '../middlewears/isAuth.js';

const router = express.Router()

router
  
  .get("/getALLGroupMembers/:groupId", isAuth,  getAllGroupMembers)
  .put("/editGroup", isAuth, isGroupAdmin, editGroup)
  .delete("deleteGroup", isAuth, isGroupAdmin, deleteGroup)
  .delete("/deleteOneMember/:memberId", isAuth, isGroupAdmin, deleteOneMember)
  .delete("/deleteALLMembers", isAuth, isGroupAdmin, deleteAllMembers)
  .delete("/deleteOneGroupRequest", isAuth, isGroupAdmin, deleteOneGroupRequest)
  


export default router