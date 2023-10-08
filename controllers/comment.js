import jwt from "jsonwebtoken";
import { Comment, Post } from "../model/schema.js"

const createComment = async (req, res) => {
     try {
         const { postId, commentsObj } = req.body
         const post = await Post.findById(postId)
         await Post.findOneAndUpdate( { _id:postId }, { Comments:commentsObj } )
         return res.status(200).send(post.Comments)
     } catch (error) {
         return res.send({msg:error.message})         
     }
}


const editComment = async(req, res) => {
    try {
       
        const myId = await jwt.verify(
          req.session.userToken,
          process.env.JWT_SECRETE
        ).user._id;
        const { postId, commentorId, commentsArr } = req.body;

        if (commentorId == myId) {
          const post = await Post.findById(postId)  
            await Post.findOneAndUpdate(
              { _id: postId },
              { Comments: commentsArr }
            );
          return res.status(200).send(post.Comments)
        }
        return res
          .status(404)
          .send({ msg: " You cannot edit this comments " });

    } catch (error) {
      return res.sendStatus(200).send({ msg: error.message })
    }
}

const getComments = async (req, res) => {
     try {
         const postId = req.params.postId
         const { Comments } = await Post.findById(postId)
         return res.sendStatus(200).send(Comments)
     } catch (error) {
       return res.sendStatus(500).send({ msg: error.message })
     }
}


const deleteComment = async (req, res) => {
  try {
    const myId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    ).user._id;

    const { postId, commentorId, commentsArr } = req.body;

    if (commentorId == myId) {
       const post = await Post.findById(postId);
       await Post.findOneAndUpdate({ _id: postId }, { Comments: commentsArr });
       return res.status(200).send(post.Comments);
    }
    return res.send(404).send({ msg: "You cannot delete this comment" });
  } catch (error) {
    return res.send(500).send({ msg: error.message });
  }
};

export { getComments, editComment, deleteComment, createComment }