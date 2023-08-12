import { User } from '../model/schema'
import jwt from 'jsonwebtoken'

const userEdit = async (req, res) => {
  const { email, username, profileImage } = req.body 
  req.session.userToken = userToken;
  const userId =  await jwt.verify(req.session.userToken, process.env.JWT.SECRETE)._id
  const user = await User.findById(userId)
  // check image size
  const userUpdated = await User.findByIdAndUpdate(userId, {
    ...user,
    username,
    email,
    profileImage,
  }); 
  return res.status(200).send({ user:userUpdated, msg:'Your info has been updated...' });             
}
export { userEdit }