import express from 'express'
import {
  adminAuth,
  groupAuthAdminOnly,
  viewALLPayments,
  getAllAdmins,
  deleteOneUser,
  getStudentsBySet,
  editeOneUser,
} from "../controllers/admin/adminPanel.js";
import { isCEEAdmin } from '../middlewears/admin.js';
import { isAuth } from '../middlewears/isAuth.js';
const router = express.Router()

router
  .post("/adminAuth", isAuth, isCEEAdmin, adminAuth)
  .post("/groupAuthAdminOnly", isAuth, isCEEAdmin, groupAuthAdminOnly)
  .get("/viewALLPayments", isAuth, isCEEAdmin, viewALLPayments)
  .get("/getAllAdmins", isAuth, isCEEAdmin, getAllAdmins)
  .get("/getStudentsBySet", isAuth, isCEEAdmin, getStudentsBySet)
  .put("/editeOneUser", isAuth, isCEEAdmin, editeOneUser)
  .delete("/deleteOneUser", isAuth, isCEEAdmin, deleteOneUser)

export default router