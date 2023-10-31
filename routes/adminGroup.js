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
  .put("/editGroup", editGroup)
  .delete("deleteGroup",  deleteGroup)
  .delete("/deleteOneMember/:memberId",  deleteOneMember)
  .delete("/deleteALLMembers",  deleteAllMembers)
  .delete("/deleteOneGroupRequest",  deleteOneGroupRequest)
  


export default router