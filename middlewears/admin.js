import { User } from "../model/schema.js";
import jwt from 'jsonwebtoken'

const isGroupAdmin = async (req, res, next) => {
  try {
     const userId = await jwt.verify(
       req.session.userToken,
       process.env.JWT_SECRETE
     ).user._id;
     const { isAdmin, canViewPanel }  = await User.findById(userId) 
     if ( isAdmin && canViewPanel == false) {
        next() 
        return          
     } 
     return res.send({msg:'You do not access this route ...'})      
  } catch (error) {
      return res.send({err:error.message})            
  }
}

const isCEEAdmin = async (req, res, next) => {
     try {
        const userId = await jwt.verify(
          req.session.userToken,
          process.env.JWT_SECRETE
        ).user._id
        const { isAdmin, canViewPanel } = await User.findById(userId); 
        if( isAdmin && canViewPanel) {
           next()
           return         
        }
        return res.send({ msg: "You do not access this route ..." })
     } catch (error) {
       return res.send({ err: error.message });
     }             
}

export { isGroupAdmin, isCEEAdmin }