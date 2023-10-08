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
  .post("/createComment", isAuth, createComment)
  .get('/getComments',isAuth, getComments)
  .put('/editComment', isAuth, editComment)
  .put('/deleteComment',isAuth, deleteComment);

export default router;