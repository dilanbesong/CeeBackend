import express from 'express'
import { Post, Group } from '../model/schema.js';
import {
  createPost,
  editPost,
  viewPost,
  deletePost,
  getPosts,
  searchPost,
  getStatusPost,
  searchGroupsAndFriends,
} from "../controllers/post.js";
import { isAuth } from '../middlewears/isAuth.js'
import { isPoster } from "../middlewears/isPoster.js"
const router = express.Router()

router
  .get("/getPosts", isAuth, getPosts)
  .get("/viewPost", isAuth, viewPost)
  .get("/getStatusPost", isAuth, getStatusPost)
  .get("/searchGroupsAndFriends/query=?searchWord", isAuth, searchGroupsAndFriends)
  .post("/createPost", isAuth, createPost)
  .post("/searchPost", isAuth, searchPost)
  .put("/editPost", isAuth, editPost)
  .delete("/deletePost", isAuth, deletePost);

export default router