import express from 'express'
import {
  createPost,
  editPost,
  viewPost,
  deletePost,
  getMyPosts,
  searchPost,
  getStatusPost,
  Postviews,
  likePost,
  getPoster,
  searchGroupsAndFriends,
  getAllPost,
  sequenciallyFetchPost,
} from "../controllers/post.js";
import { isAuth } from '../middlewears/isAuth.js'
import { isPoster } from "../middlewears/isPoster.js"
import { friendsSuggestions } from '../suggestions/friendSuggestions.js';
import { groupSuggestions } from '../suggestions/groupSuggestions.js';

const router = express.Router()

router
  .get("/getMyPosts/:userId", isAuth, getMyPosts) // getting my own posts
  .get("/getAllPost", isAuth, getAllPost) // all/general post
  .get(
    "/sequenciallyFetchPost/:skipCount/:postLimit",
    isAuth,
    sequenciallyFetchPost
  )
  .post("/viewPost", isAuth, viewPost)
  .post("/likePost", isAuth, likePost)
  .post("/numberOFviews", isAuth, Postviews)
  .get("/getStatusPost", isAuth, getStatusPost)
  .get("/getPoster/:posterId", isAuth, getPoster)
  .get("/searchGroupsAndFriends/:searchWord", isAuth, searchGroupsAndFriends)
  .get("/searchPost/:searchWord", isAuth, searchPost)
  .get("/friendSuggestions", isAuth, friendsSuggestions)
  .get("/groupSuggestions", isAuth, groupSuggestions)
  .post("/createPost", isAuth, createPost)
  .put("/editPost", isAuth, editPost)
  .delete("/deletePost/:postId/:poster", isAuth, deletePost);

export default router