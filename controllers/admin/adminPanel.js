import { Group, Payment, User } from "../../model/schema.js"
import { SaveToCookie } from "../../Services/saveCookie.js"
import Active from "../active.js"
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const AuthAdmins = async ( req, res, username, password, email, sex, isAdmin, canViewPanel=false ) => {
           const saltRounds = 10;
           const salt = await bcrypt.genSalt(saltRounds);
           const encryptedPassword = await bcrypt.hash(password, salt);

           const user = { ...req.body, password: encryptedPassword, canViewPanel }

           const newAdmin = new User(user)
           const userToken = jwt.sign(
             { user: newAdmin },
             process.env.JWT_SECRETE,
             {
               expiresIn: "24h",
             }
           );
           await newAdmin.save();
           SaveToCookie(req, userToken);
           Active(httpServer, newUser._id);
           return res.status(200).send(newAdmin);
};

const adminAuth = async (req, res) => {
    try {
         const { username, password, email, sex, isAdmin, canViewPanel } = req.body
         // canViewPanel=true
         AuthAdmins(req, res, username, password, email, sex, isAdmin, canViewPanel)
                   
    } catch (error) {
      return res.status(500).send({msg:error.message})        
    }              
}

const groupAuthAdminOnly = async (req, res) => {
     try {
         const { username, password, email, sex, isAdmin } = req.body
          AuthAdmins(  req, res, username, password, email, sex, isAdmin )

     } catch (error) {
       return res.status(500).send({ msg: error.message })          
     }             
}

const viewALLPayments = async (req, res) => {
   try {
      const payments = await Payment.find()
      return res.status.send(payments)
   } catch (error) {
     return res.status(500).send({msg:error.message})
   }
}

const getAllAdmins = async (req, res) => {
   try {
      const admins = await User.find({ isAdmin:true })
      return res.status(200).send(admins)
   } catch (error) {
      return res.status(500).send({ msg: error.message });
   }
}

const deleteOneUser = async (req, res) => {
   try {
      const { userId } = req.body
      const users = await User.find({ canViewPanel:{$neq:true} })
      await User.findByIdAndDelete(userId)
      await Promise.all( users.map( async (user) => {
        if( await Group.find({groupcreator:user._id})){
          await Group.deleteOne({ groupcreator: user._id });
          return
        }
        return
      }))
      return res.status(200).send(users)
   } catch (error) {
      return res.status(500).send({ msg: error.message })
   }
}

const editeOneUser = async (req, res) => {
  try {
     const { userId, userData } = req.body
     const anotherAdmin = await User.findById(userId)
     const { isAdmin } = await jwt.verify(
       req.session.userToken,
       process.env.JWT_SECRETE
     ).user;
     if( isAdmin === anotherAdmin.isAdmin) return
     await User.findByIdAndUpdate(userId, {...userData})
     const user = await User.findById(userId)
     return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
}

const getStudentsBySet = async (req, res) => {
   try {
     const { YearOfEntry } = req.body
     const users = await Users.find({YearOfEntry})
     return res.status(200).send(users)
   } catch (error) {
      return res.status(500).send({ msg: error.message });
   }
}

export { 
       adminAuth,
       groupAuthAdminOnly, 
       viewALLPayments,
       getAllAdmins,
       deleteOneUser, 
       getStudentsBySet, 
       editeOneUser 
      }