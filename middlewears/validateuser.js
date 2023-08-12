
import {ValidateUser, ValidateAdmin} from "../Services/validate.js"
import { User } from "../model/schema.js";





const validateCredencials = ( req, res, next) => {
   const {
     username,
     email,
     regNumber,
     YearOfEntry,
     level,
     sex,
     password,
     PhoneNumber,
   } = req.body;
   const user = new ValidateUser(
     username,
     email,
     regNumber,
     YearOfEntry,
     level,
     sex,
     password,
     PhoneNumber
   );
   
   user.isYearOfEntry();
   user.isEmail();
   user.isPassword();
   user.isRegNumber();
   user.isUsername();
   user.isPhoneNumber();
   let msg = undefined;
   for (const str of user.messages) {
     if (typeof str == "string") {
       msg = str;
     }
   }
   if( typeof msg == 'string'){
      return res.send({errorMessage: msg})
   }else {
      next()
   }
   
   
   
   
   
}

const isExist = async ( req, res, next) => {
     try {
        const { email, regNumber, PhoneNumber } = req.body
        const userEmail = await User.findOne({ email })
        const userRegNumber = await User.findOne({ regNumber })
        const userPhoneNumber = await User.findOne({ PhoneNumber }) 
        if (userEmail  || userRegNumber || userPhoneNumber) {
          return res.send({ msg: "This user has an account!!!" });
        } 
          next()
        
                 
     } catch (error) {
        return res.send({msg:error.message})          
     }
}

const validateAdmin = async (req, res, next) => {
 try {
    const { email, username, password } = req.body;
    const adminUser = await User.findOne({email})
    const validateAdmin = new ValidateAdmin(email, username, password)
    if (!validateAdmin.isEmail()) return res.send({ msg: "Invalid email!" }) 
    if(adminUser !== null) return res.send({msg:'This user already exist'})
    if(!validateAdmin.isUsername) return res.send({ msg: "Invalid username!" })
    if(!validateAdmin.isPassword()) return res.send({msg:'Invalid password'})
    next()
 } catch (error) {
    return res.send({ msg: error.message })
 }
}

export  { isExist, validateCredencials, validateAdmin }