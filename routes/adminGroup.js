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
  
  .get("/getALLGroupMembers/:groupId",  getAllGroupMembers)
  .put("/editGroup", isGroupAdmin, editGroup)
  .delete("deleteGroup", isGroupAdmin, deleteGroup)
  .delete("/deleteOneMember/:memberId", isGroupAdmin, deleteOneMember)
  .delete("/deleteALLMembers", isGroupAdmin, deleteAllMembers)
  .delete("/deleteOneGroupRequest", isGroupAdmin, deleteOneGroupRequest)
  


export default router