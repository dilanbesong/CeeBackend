import express from 'express';
import {
  getComments,
  editComment,
  deleteComment,
  createComment,
} from "../controllers/comment.js";
import { isAuth } from '../middlewears/isAuth.js';
const router = express.Router();

router
  .post("/createComment", createComment)
  .get('/getComments', getComments)
  .put('/editComment', editComment)
  .put('/deleteComment', deleteComment);

export default router;