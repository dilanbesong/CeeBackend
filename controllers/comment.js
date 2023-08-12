import { Comment, Post } from "../model/schema.js"

const createComment = async (req, res) => {
     try {
        const { commentorsId, postId, parentCommentId, body }  = req.body  
        const parentComment = parentCommentId ? await Comment.findById(parentCommentId) : null   
        const newComment = new Comment({ commentorsId, body }) 
        if(parentComment) {
          parentComment.Replies.push(newComment)
          await parentComment.save();
        }else {
           await Post.updateOne(
             { _id: postId },
             { $push: { Comments: newComment._id } }
           );
           await newComment.save()
        }
        return res.status(201).send(newComment)
     } catch (error) {
         return res.send({msg:error.message})         
     }
}

const deleteComment = async (req, res) => {
     try {
      const { commentorsId, parentCommentId, commentId } = req.body
      const comment = await Comment.findById(commentId)
      if( commentorsId !== comment.commenterorId) return res.send({msg:'You cannot delete this comment'})
      const deleteComment = await Comment.findByIdAndDelete(commentId, { new:true})
      await Comment.updateOne({ _id: parentCommentId }, { $pull: { Replies: commentId } })
      if(!deleteComment){
        return res.send({ msg:'Comment has been deleted'})
      }

     } catch (error) {
       return res.send({ msg: error.message })
     }
}

const editComment = async(req, res) => {
    try {
      const { commentorsId, commentId, text } = req.body
        const comment = await Comment.findById(commentId);
        if (commentorsId !== comment.commenterorId)
          return res.send({ msg: "You cannot edit this comment" })
       const updatedComment = await Comment.findByIdAndUpdate(commentId, { body:text })
       return res.status(200).send(updatedComment)

    } catch (error) {
      return res.send({ msg: error.message })
    }
}

const getComments = async (req, res) => {
     try {
      const { postId } = req.body
      const { Comments } = await Post.findById(postId)
      const comments = await Comment.find({_id:{ $in:Comments }}).populate('Replies')
      return res.status(200).send(comments)
     } catch (error) {
       return res.send({ msg: error.message })
     }
}

export { getComments, editComment, deleteComment, createComment }