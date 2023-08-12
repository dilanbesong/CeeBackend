
import sendMail from '../Services/sendEmail.js'
import { User } from "../model/schema.js";
import pkg from 'jsonwebtoken'
const { Jwt } = pkg;



const getResetCode = async (req, res) => {
   const { email } = req.body
   const user = await User.findOne({email})

   if(user == null) return res.status(500).send({msg:'Invalid user, please contact the cee department'})

   const resetCode = Math.floor(Math.random() * 1001 + 99999).toString()

   const resetCodeToken = await Jwt.sign({resetCode}, process.env.Jwt_SECRETE, {
     expiresIn:'5m'             
   })
   req.session.resetCode = resetCodeToken
   req.session.hasCode = true
   sendMail(user.email, req.session.resetCode.toString())
   return res.status(200).send({ isSendCode:true, msg:'code sent' })

}

const resetPassword = async(req, res) => {
  const { resetCode, newPassword, confirmPassword } = req.body
  const verifiedResetCode = await Jwt.verify(req.session.resetCodeToken, process.env.Jwt_SECRETE).resetCode

  if( resetCode == verifiedResetCode ){
     if( newPassword == confirmPassword){
         const salt = await bcrypt.genSalt(saltRounds)
         const encryptedPassword = await bcrypt.hash(req.body.password, salt) 
         await User.findOneAndUpdate({ email }, {password:encryptedPassword}) 
         return res.send({ msg: "Password has been reseted!!", isPasswordReset:true})        
     } 
     return res.send({msg:'Please properly confirm your password'})             
  }
  return res.status(500).send( { msg:'Invalid code!!'})
}

export { getResetCode, resetPassword }