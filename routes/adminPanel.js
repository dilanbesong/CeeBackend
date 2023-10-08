import express from 'express'
import {
  getAllAdmins,
  deleteOneUser,
  getStudents,
  blockAccount,
  getYearOptions,
} from "../controllers/admin/adminPanel.js";
import { isCEEAdmin } from '../middlewears/admin.js';
import { isAuth } from '../middlewears/isAuth.js';
const router = express.Router()

router
  .get("/getAllAdmins", isAuth, isCEEAdmin, getAllAdmins)
  .get("/getStudents/:YearOfEntry", isAuth, getStudents)
  .get("/getYearOptions", isAuth, isCEEAdmin, getYearOptions)
  .put("/blockAccount", isAuth,  blockAccount)
  .delete("/deleteOneUser/:userId", isAuth, isCEEAdmin, deleteOneUser);

export default router