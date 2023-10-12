import { Group, Notification, User } from "../model/schema.js";
import jwt from 'jsonwebtoken'


const createNotification = async (req, res) => {
   try {
    //  const userId = await jwt.verify(
    //    req.session.userToken,
    //    process.env.JWT_SECRETE
    //  ).user._id;
     
    const { notificatorId, postId } = req.body
    
      if(notificatorId == 'CEE') {
           const notification = new Notification({
             message: `CEE department posted check it out`,
             redirectUrl: `/home/post/${postId}`,
             notificatorId
           });
           
           await User.updateMany(
             {},
             { $push: { NotificationList: notification } }
           );
           return res.status(200).send({ isNotify:true})
        }

      else if (await User.findById(notificatorId)) {
         console.log('only friends can see notification...');
        const user = await User.findById(notificatorId);

        const notification = new Notification({
          message: `Engr ${user.username} created a new post !!`,
          redirectUrl: `/home/post/${postId}`,
          notificatorId,
        });
        await User.updateOne( { _id:notificatorId }, { $push: { NotificationList: notification } } )
        await User.updateMany(
          { _id: { $in: user.FriendList } },
          { $push: { NotificationList: notification } }
        );
        return res.status(200).send({ isNotify: true });
      } else {
        const group = await Group.findById(notificatorId);
        const notification = new Notification({
          message: ` ${group.groupName} made a new post !!`,
          redirectUrl: `/home/post/${postId}`,
          notificatorId,
        });
        await User.updateMany(
          { _id: { $in: group.groupMembers } },
          { $push: { NotificationList: notification } }
        );
        return res.status(200).send({ isNotify: true });
      }
            
        

     // { message:``, redirectUrl:``, notificatorId:'' }
     
   } catch (error) {
    return res.send({ msg: error.message }); 
   }
}

const getNotification = async ( req, res) => {
   try {
          //  const userId = await jwt.verify(
          //    req.session.userToken,
          //    process.env.JWT_SECRETE
          //  ).user._id;
           const { userId } = req.params
          
          const { NotificationList } = await User.findById(userId); 
          return res.status(200).send({ NotificationList });      
   } catch (error) {
        return res.send({msg:error.message})          
   }
}
const deleteOneNotification = async ( req, res) => {
  
    try {
      const { notificationId, userId } = req.body;
      //  const userId = await jwt.verify(
      //    req.session.userToken,
      //    process.env.JWT_SECRETE
      //  ).user._id;
  
      const user = await User.findById(userId)
      let NotificationList = []
      NotificationList = user.NotificationList.filter( (notify) => notify._id !== notificationId)
      user.NotificationList = NotificationList
      await user.save()
      return res.status(200).send({ notificationId })

    } catch (error) {
      return res.send({ msg: error.message });
    }
}


const clearAllNotifications = async (req, res) => {
    try {
      //  const userId = await jwt.verify(
      //    req.session.userToken,
      //    process.env.JWT_SECRETE
      //  ).user._id;
      const { userId } = req.params
      const user = await User.findById(userId)
     // await Notification.deleteMany({_id: { $in:user.NotificationList }})
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

const tapNotification = async (req, res) => {
  try {
      const { notificationId, userId } = req.params
      const user = await User.findById(userId)
      console.log(req.params);

  } catch (error) {
     return res.send({ msg: error.message });
  }
}
export {
  getNotification,
  deleteOneNotification,
  clearAllNotifications,
  searchNotifications,
  createNotification,
  tapNotification,
};