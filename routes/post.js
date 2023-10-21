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
  .get("/getAllPost",  getAllPost) // all/general post
  .get(
    "/sequenciallyFetchPost/:skipCount/:postLimit",
    isAuth,
    sequenciallyFetchPost
  )
  .post("/viewPost",  viewPost)
  .post("/likePost",  likePost)
  .post("/numberOFviews",  Postviews)
  .get("/getStatusPost", isAuth, getStatusPost)
  .get("/getPoster/:posterId",  getPoster)
  .get("/searchGroupsAndFriends/:searchWord",  searchGroupsAndFriends)
  .get("/searchPost/:searchWord",  searchPost)
  .get("/friendSuggestions",  friendsSuggestions)
  .get("/groupSuggestions",  groupSuggestions)
  .post("/createPost",  createPost)
  .put("/editPost",  editPost)
  .delete("/deletePost/:postId/:poster",  deletePost);

export default router