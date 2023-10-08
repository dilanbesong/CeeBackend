import { Notification, User } from "../model/schema.js";
import jwt from 'jsonwebtoken'
const getNotification = async ( req, res) => {
   try {
           const userId = await jwt.verify(
             req.session.userToken,
             process.env.JWT_SECRETE
           ).user._id;
          const { NotificationList } = await User.findById(userId); 
          return res.status(200).send({ Notificationlist });      
   } catch (error) {
        return res.send({msg:error.message})          
   }
}
const deleteOneNotification = async ( req, res) => {
    try {
      const { notificationId } = req.body
       const userId = await jwt.verify(
         req.session.userToken,
         process.env.JWT_SECRETE
       ).user._id;
      const user = await User.findById(userId)
      let NotificationList = []
      NotificationList = user.NotificationList.filter( (notify) => notify._id !== notificationId)
      user.NotificationList = NotificationList
      await user.save()
      return res.status(200).send({ NotificationList:user.NotificationList })

    } catch (error) {
      return res.send({ msg: error.message });
    }
}


const clearAllNotifications = async (req, res) => {
    try {
       const userId = await jwt.verify(
         req.session.userToken,
         process.env.JWT_SECRETE
       ).user._id;
      const user = await User.findById(userId)
      await Notification.deleteMany({_id: { $in:user.NotificationList }})
      user.NotificationList = []
      await user.save()
      
      return res.send({ Notifications: user.NotificationList })
    } catch (error) {
      return res.send({ msg: error.message });
    }
}

const searchNotifications = async (req, res ) => {
   try {
      const { searchInput } = req.params
       const userId = await jwt.verify(
         req.session.userToken,
         process.env.JWT_SECRETE
       ).user._id;
      const user = await User.findById(userId)
     
     let notificationResults = []
      notificationResults = user.NotificationList.filter((notify) => {
        return notify.message.toLowerCase(searchInput.toLowerCase());
      });

      return res.status(200).send({ notificationResults });
   } catch (error) {
      return res.send({ msg: error.message });
   }
}
export { getNotification, deleteOneNotification, clearAllNotifications, searchNotifications }