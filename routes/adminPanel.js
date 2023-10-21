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
  .get("/getAllAdmins", isCEEAdmin, getAllAdmins)
  .get("/getStudents/:YearOfEntry", getStudents)
  .get("/getYearOptions", isCEEAdmin, getYearOptions)
  .put("/blockAccount",  blockAccount)
  .delete("/deleteOneUser/:userId", isCEEAdmin, deleteOneUser);

export default router