import jwt from "jsonwebtoken"
import { Group, Post, User } from "../model/schema.js"

const createPost = async (req, res) => {
  try {
    const userId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    ).user._id;

    const { body, postFiles, poster, category, postStatus } = req.body;
    

    if (poster == "CEE") {
      //@ reduce files here
      const newPost = await Post.create(req.body);
      const users = await User.find();
      const userIds = users.map((user) => user._id);
      await User.updateMany(
        { _id: { $in: userIds } },
        { $push: { Posts: newPost._id } }
      );
      return res.status(200).send({ msg: "Posted by cee !" });
    }
    if (poster == userId) {
      const { FriendList, username } = await User.findById(userId);
      const newPost = await Post.create(req.body);
      const currentFriendListIDs = await Promise.all(
        FriendList.map(async (friendId) => {
          if ((await User.findById(friendId)) == null) {
            await User.updateOne(
              { _id: userId },
              { $pull: { FriendList: friendId } }
            );
          }
          return friendId;
        })
      );
      await User.updateMany(
        { _id: { $in: currentFriendListIDs } },
        { $push: { Posts: newPost._id } }
      );
      await User.updateOne({ _id: userId }, { $push: { Posts: newPost._id } });
      return res.status(200).send({ msg: `Posted by cee ${username} !` });
    }
    const group = await Group.findById(poster);
    if (group) {
      const newPost = await Post.create(req.body);
      const { groupMembers } = group;
      const groupMembersIDs = await Promise.all(
        groupMembers.map(async (memberId) => {
          if ((await User.findById(memberId)) == null) {
            await Group.updateOne(
              { _id: group._id },
              { $pull: { groupMembers: memberId } }
            );
          }
          return memberId;
        })
      );
      await User.updateMany(
        { _id: { $in: groupMembersIDs } },
        { $push: { Posts: newPost._id } }
      );
      return res.status(200).send({ msg: `Posted by ${group.groupName} !` });
    }
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId, poster, body, category } = req.body;

    const post = await Post.findById(postId)

     async function edit() {
  
       const editedPost = await Post.findByIdAndUpdate(postId, {
         body,
         category,
       })
       return res.status(200).send({ post:editedPost, isEdit: true })
     }
    
       if (post.poster == poster) edit();
       return res.send({ msg: "Unauthorize edit to this post !" });
    // { "postId":"64d3dd593a3cd54f0bcf1de5", "poster":"CEE", "body":"Edited by user ","category":"all" }
  } catch (error) {
    return res.send({ msg: error.message });
  }
};


const deletePost = async (req, res) => {
  try {

    const { postId, poster } = req.body;
    const post = await Post.findById(postId);
    
    if(post.poster == poster){
      const deletePost = await Post.findByIdAndDelete(postId);
      return res.status(200).send({ msg: "post deleted", deletePost })
    }
    return res.send({ msg: "Unauthorize delete to this post !" })
    
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const viewPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    res.status(200).send(post);
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const userId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    ).user._id;
    //const { category, fetchCount, poster } = req.body;
    const { Posts } = await User.findById(userId);

    const currentPostIDs = await Promise.all(
      Posts.map(async (postId) => {
        if ((await Post.findById(postId)) == null) {
          await User.updateOne({ _id: userId }, { $pull: { Posts: postId } });
        }
        return postId;
      })
    );
  
    const posts = await Post.find(
      { _id: { $in: currentPostIDs }, postType: { $ne: "status" } }

    );

    // const posts = await Post.find({ category }, { poster:{$neq:'status'} }).limit(fetchCount);
    return res.send({ posts });
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const getStatusPost = async (req, res) => {
  try {
    const statusPost = await Post.find({ postType: { $eq: "status" } });
    return res.status(200).status(statusPost);
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    const { Likes } = await Post.findById(postId);
    if (Likes.includes(userId))  return res.status(200).send(Likes)
    
    await Post.updateOne({ _id: postId }, { $push: { Likes: userId } })
    return res.status(200).send(Likes);
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const getLikesFromPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const { Likes } = await Post.findById(postId);
    const LikesIDs = await Promise.all(
      Likes.map(async (likeId) => {
        if ((await User.findById(likeId)) == null) {
          await Post.updateOne({ _id: postId }, { $pull: { Likes: likeId } });
        }
        return likeId;
      })
    );
    const f = new Intl.NumberFormat(undefined,{ notation:"compact"})
    return res.status(200).send(f.format(LikesIDs.length))
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const searchPost = async (req, res) => {
  try {
    const searchWord = req.query.searchWord.toString().toLowerCase();
    const posts = await Post.find();
    const suggestedList = posts.filter(({ category, body, createdAt }) => {
      return (
        body.includes(searchWord) ||
        body.includes(searchWord) ||
        body.includes(category) ||
        createdAt.includes(searchWord)
      );
    });
    return res.status(200).send(suggestedList);
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const searchGroupsAndFriends = async (req, res) => {
  try {
    const { searchWord } = req.query;
    const groups = await Group.find();
    const users = await User.find();
    const groupsAndFriendsData = groups.concat(users);
    const suggestions = groupsAndFriendsData.filter((data) => {
      return (
        data.username.includes(searchWord.toLowerCase()) ||
        data.regNumber.includes(searchWord.toLowerCase()) ||
        data.email.includes(searchWord.toLowerCase()) ||
        data.groupName.startsWith(searchWord.toLowerCase())
      );
    });
    return res.status(200).send(suggestions);
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

export {
  createPost,
  editPost,
  viewPost,
  deletePost,
  getPosts,
  searchPost,
  getStatusPost,
  searchGroupsAndFriends,
  likePost,
  getLikesFromPost,
};


//  { 
//         "body":"This post is a departmental post", 
//         "postFiles":[], 
//         "poster":"CEE", 
//         "postStatus":"post"
//      }