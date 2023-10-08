
import sendMail from '../Services/sendEmail.js'
import { User } from "../model/schema.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'




const getResetCode = async (req, res) => {
   try {
     const { email } = req.body;
     const user = await User.findOne({ email });
    
     if (user == null)
       return res
         .status(500)
         .send({ msg: "Invalid user, please contact the cee department" });

     const resetCode = Math.floor(Math.random() * 1001 + 99999).toString();

     const resetCodeToken = await jwt.sign(
       { resetCode },
       process.env.Jwt_SECRETE,
       {
         expiresIn: "5m",
       }
     );
     req.session.resetCode = resetCode;
     req.session.hasCode = true;

    sendMail(user.email, req.session.resetCode.toString()) 
    return res.status(200).send({ isSendCode: true, msg: "code sent" });
    
     
   } catch (error) {
     return res.send({ error: error.message })
   }

}


function isValidPassword(password) {
    // Contains letters, symbols, and special characters, 8 characters long - should match
   const passwordRegex =
     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/   
    if (passwordRegex.test(password)) { 
       return true 
    }
      return false
  }

const resetPassword = async (req, res) => {
  try {
     const {email, resetCode, newPassword } = req.body;
     const saltRounds = 10
     if(isValidPassword(newPassword)){
        if (resetCode == req.session.resetCode) {
          const salt = await bcrypt.genSalt(saltRounds);
          const encryptedPassword = await bcrypt.hash(newPassword, salt);
          await User.findOneAndUpdate(
            { email },
            { password: encryptedPassword }
          );
          return res
            .status(200)
            .send({
              msg: "Password has been reseted, go back and login!",
              isPasswordReset: true,
            });
        }
        return res.send({ error: "Invalid reset code!!" });
     }
  return res.send({
    error:
      " Password must Contain letters, numbers, symbols, special characters, at least 8 characters long ",
  });
     
  } catch (error) {
    return res.send({ error : error.message})
  }
}

export { getResetCode, resetPassword }