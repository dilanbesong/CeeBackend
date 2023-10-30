
import { Group, Post, User } from "../model/schema.js"

const createPost = async (req, res) => {
  try {
    const { body, fileList, poster, userId, category, postStatus } = req.body;
    const objectWithoutUserID = (object, key) => {
      const {[key]:deletedKey,...otherKeys} = object

      return otherKeys
    }

    //{ "email":"tekoh@gmail.com", "password":"201A90@30187292" }
    if (poster == "CEE") {
    
      const newPost = new Post({ ...objectWithoutUserID(req.body, 'userId'), poster: "CEE" });
      await newPost.save();
      console.log(newPost);
      const users = await User.find();
      const userIds = users.map((user) => user._id);
      await User.updateMany(
        { _id: { $in: userIds } },
        { $push: { Posts: newPost._id } }
      );
      return res.status(200).send(newPost);
    }
    if (poster == "user" || poster == "") {
      
      console.log(userId);
      const { FriendList, username } = await User.findById(userId);
      const newPost = new Post({ ...objectWithoutUserID(req.body, 'userId'), poster: userId });
      await newPost.save();

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
      return res.status(200).send(newPost);
    }

    const group = await Group.findById(poster);
    if (group) {
      const newPost = new Post(objectWithoutUserID(req.body, "userId"));
      await newPost.save();

      await Group.updateOne(
        { _id: group._id },
        { $push: { groupPost: newPost._id } }
      );
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
      return res.status(200).send(newPost);
    }
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId, poster, body, fileList } = req.body;
     
    const post = await Post.findById(postId)
    const { isAdmin } = await User.findById(poster)
       if (post.poster == poster || isAdmin ){
          const editedPost = await Post.findByIdAndUpdate(postId, {
            body,
            fileList,
          });
          return res.status(200).send({ post: editedPost, isEdit: true });
       }
       return res.send({ msg: "Unauthorize edit to this post !" });
    // { "postId":"64d3dd593a3cd54f0bcf1de5", "poster":"CEE", "body":"Edited by user ","category":"all" }
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};


const deletePost = async (req, res) => {
  try {

    const { postId, poster } = req.params;
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
    return res.status(200).send(post);
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const userId = req.params.userId
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

const getAllPost = async (req, res) => {
 try {
     const posts = await Post.find()
     return res.status(200).send({ posts })
 } catch (error) {
     return res.status(500).send({ err: error.message})
 }
}

const sequenciallyFetchPost = async (req, res) => {
  try {
     const { skipCount, postLimit } = req.params
     const posts = await Post.find().skip(parseInt(skipCount)).limit(parseInt(postLimit))
     return res.status(200).send({ posts });
  } catch (error) {
    return res.status(500).send({ err: error.message });
  }
}

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
    if (Likes.includes(userId)){
         await Post.updateOne({ _id: postId }, { $pull: { Likes: userId } });
         return res.status(200).send(Likes);
    }else {
        await Post.updateOne({ _id: postId }, { $push: { Likes: userId } });
        return res.status(200).send(Likes);
    }
  } catch (error) {
    return res.send({ msg: error.message });
  }
};


const searchPost = async (req, res) => {
  try {
    const {searchWord } = req.params;
    const posts = await Post.find();

    const suggestedList = posts.filter((post) => {
         if(searchWord === '') return post
      return (
        post.body.includes(searchWord.toLowerCase()) ||
        post.category.includes(searchWord.toLowerCase()) ||
        new Date(post.createdAt).toLocaleDateString().includes(searchWord.toLowerCase())
      );
    });
    return res.status(200).send(suggestedList);
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const searchGroupsAndFriends = async (req, res) => {
  try {
    const { searchWord } = req.params;
    
    const groups = await Group.find();
    const users = await User.find();
    const groupsAndFriendsData = [ ...users, ...groups ];
    const suggestions = groupsAndFriendsData.filter((data) => {
      if(data.groupName){
         return data;
      }
      else if(data.username || data.regNumber || data.email){
        return (
          data.username.includes(searchWord.toLowerCase()) ||
          data.regNumber.includes(searchWord.toLowerCase()) ||
          data.email.includes(searchWord.toLowerCase())
        );
      }
      return data
    });

    return res.status(200).send({ suggestions });
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const getPoster = async ( req, res) => {
   try {
    const posterId = req.params.posterId

    if(posterId == 'CEE'){
      return res.status(200).send({
        posterImage:
          "https://tse2.mm.bing.net/th?id=OIP.Oprpe36XqXLL_HjlF04i2QAAAA&pid=Api&P=0&h=180",
        posterName: "CEE",
        postType: "CEE",
        navigateToProfileUrl:'/home/main'
      });
    }

    const user = await User.findById(posterId)
    const group = await Group.findById(posterId)
    
    if(user && group == null){
       return res.status(200).send({
         posterImage: user.profileImage,
         posterId: posterId,
         posterName: user.username,
         postType: "user",
         navigateToProfileUrl:`/home/profile/${posterId} `
       });
    }else if(group && user == null){
    
      return res.status(200).send({
        posterImage: group.groupProfile,
        posterId: posterId,
        posterName: group.groupName,
        postType: "group",
        navigateToProfileUrl:`/home/group/${posterId}`
      });
    }
   
   } catch (error) {
     return res.status(500).send({ err: error.message})
   }
}

const Postviews = async (req, res) => {
   try {
       const { postId } = req.body
       const post =  await Post.findById(postId)
       post.views += 1
       await post.save()
       return res.status(200).send(post.views)
   } catch (error) {
      return res.status(500).send({ err: error.message });
   }
}

export {
  createPost,
  editPost,
  viewPost,
  deletePost,
  getMyPosts,
  getAllPost,
  searchPost,
  getStatusPost,
  searchGroupsAndFriends,
  getPoster,
  likePost,
  Postviews,
  sequenciallyFetchPost,
};


//  { 
//         "body":"This post is a departmental post", 
//         "postFiles":[], 
//         "poster":"CEE", 
//         "postStatus":"post"
//      }