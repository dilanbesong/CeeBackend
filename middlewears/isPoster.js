import { Post } from "../model/schema.js";
import jwt from 'jsonwebtoken'
const isPoster = async (req, res, next) => {
    const { postId }  = req.body 
    const { poster } = await Post.findById(postId)  
    const myId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    )._id;
    if( myId !== poster){
     return res.status(404).send({ msg:"You cannot alter this post"})
    }
    next()        
}
export { isPoster }