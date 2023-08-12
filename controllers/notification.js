import { Notification, User } from "../model/schema.js";
const getNotification = async ( req, res) => {
   try {
          const myId = await jwt.verify(
            req.session.userToken,
            process.env.JWT_SECRETE
          )._id;
          const { NotificationList } = await User.findById(myId); 
          const savedNotificationID = await Promise.all( NotificationList.map( async(infoId) => {
             if( await Notification.findById(infoId) == null){
                await User.updateOne( {_id:myId}, { $pull:{ NotificationList:infoId } })
             }
             return infoId
          })) 
          const Notifications = await Notification.find({
            _id: { $in: savedNotificationID },
          });
          return res.send({ Notifications });      
   } catch (error) {
        return res.send({msg:error.message})          
   }
}
const deleteOneNotification = async ( req, res) => {
    try {
      const { notificationId } = req.body
      const myId = await jwt.verify(
        req.session.userToken,
        process.env.JWT_SECRETE
      )._id;
      const { NotificationList } = await User.findById(myId)
      await Notification.findByIdAndDelete(notificationId)
      await User.updateOne(
        { _id: myId },
        { $pull: { NotificationList: infoId } }
      );
      return res.send({ Notifications:NotificationList})

    } catch (error) {
      return res.send({ msg: error.message });
    }
}


const clearAllNotifications = async (req, res) => {
    try {
      const myId = await jwt.verify(
        req.session.userToken,
        process.env.JWT_SECRETE
      )._id;
      const user = await User.findById(myId)
      await Notification.deleteMany({_id: { $in:user.NotificationList }})
      user.NotificationList = []
      await user.save()
      
      return res.send({ Notifications: user.NotificationList })
    } catch (error) {
      return res.send({ msg: error.message });
    }
}
export { getNotification, deleteOneNotification, clearAllNotifications }