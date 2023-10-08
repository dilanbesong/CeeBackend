import { User, Notification, Chat } from '../model/schema.js'
import { hasChat } from '../Services/mutualArray.js';
import jwt from 'jsonwebtoken'


const getMyFriendList = async (req, res) => {
  try {
    const userId = req.params.userId
    // const userId = await jwt.verify(
    //   req.session.userToken,
    //   process.env.JWT_SECRETE
    // ).user._id;

    const { FriendList } = await User.findById(userId);
    if (FriendList.length == 0) return res.send({ Friends: [] });

    const getFriends = await Promise.all(
      FriendList.map(async (friendId) => {
        if ((await User.findById(friendId)) == null) {
          await User.updateOne(
            { _id: memberId },
            { $pull: { FriendRequestList: friendId } }
          )
        }
        return friendId
      })
    );
    const Friends = await User.find({ _id: { $in: getFriends } });

    return res.status(200).send({ Friends });
  } catch (error) {
    return res.status(500).send({ err: error.message });
  }
};


const sendFriendOneRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const myId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    ).user._id;

   const user = await User.findById(myId)
   const friend = await User.findById(friendId)

   if (
     user.SentFriendRequestList.includes(friendId) ||
     friend.FriendRequestList.includes(myId)
   ) return res.send({ msg:'You have already made a request'})
    
     
     await User.updateOne(
       { _id: myId },
       { $push: { SentFriendRequestList: friendId } }
     );
    
     await User.updateOne(
       { _id: friendId },
       { $push: { FriendRequestList: myId } }
     );
    
    
    return res.status(200).send({ msg:'Your request has been sent!' });
  } catch (error) {
    return res.status(500).send({ err: error.message });
  }
};

const acceptOneFriendRequest = async ( req, res) => {
    try {
      const { friendId, myId } = req.body
    
        
        const friend = await User.findById(friendId);
        const user = await User.findById(myId)

        await User.updateOne(
          { _id: myId },
          { $pull: { FriendRequestList: friendId } } // pullx friend from friend request list
        );
        await User.updateOne(
          { _id: friendId },
          { $pull: { SentFriendRequestList: myId } } // pullx myself from my friend sent request list
        );

        async function addNewFriend(){
          await User.updateOne(
            { _id: friendId },
            { $push: { FriendList: myId } } // addx myself to my friends friendlist
          );
          await User.updateOne(
            { _id: myId },
            { $push: { FriendList: friendId } } // addx friend to my friend list
          );
        }

        async function createChatIDForWeBoth() {
          const chatList1 = new Chat({ friendId, myId })
          const chatList2 = new Chat({ friendId, myId });
          await chatList1.save()
          await chatList2.save()
          await User.updateOne(
            { _id: friendId },
            { $push: { ChatList: { memberId:myId, chatId:chatList1._id } } }// addx me(you) as message object for new friend
          );
          await User.updateOne(
            { _id: myId },
            { $push: { ChatList: { memberId:friendId, chatId: chatList2._id } } } // adding friend as message object for me(you)
          );
        }

       
        
        if(hasChat( user.ChatList, friendId) && hasChat(friend.ChatList, myId) == false){
          const chatList = new Chat({ friendId, myId });
          await chatList.save()
          await User.updateOne(
            { _id: friendId },
            { $push: { ChatList: { memberId: myId, chatId: chatList._id } } } // addx me(you) as message object for new friend
          );
           addNewFriend();
           return res.status(200).send({ Friends: user.FriendList, friendId }); 
        }

        else if( hasChat(friend.ChatList, myId) &&  hasChat(user.ChatList, friendId) == false){
          const chatList = new Chat({ friendId, myId });
          await chatList.save()
          await User.updateOne(
            { _id: myId },
            { $push: { ChatList: { memberId:friendId, chatId: chatList._id } } } // adding friend as message object for me(you)
          );
          addNewFriend();
          return res.status(200).send({ Friends: user.FriendList, friendId }); 
        }
        
           createChatIDForWeBoth();
           addNewFriend();
           return res.status(200).send({ Friends: user.FriendList, friendId }); 
        
    } catch (error) {
      return res.status(500).send({ err: error.message })
    }
}


const rejectOneFriendRequest = async (req, res) => {
  try {
      const { friendId, myId } = req.body
      
      // const myId = await jwt.verify(
      //   req.session.userToken,
      //   process.env.JWT_SECRETE
      // ).user._id;

     const { FriendRequestList } = await User.findById(myId);
      await User.updateOne(
        { _id:myId },
        { $pull: { FriendRequestList: friendId } }
      );
      await User.updateOne(
        { _id: friendId },
        { $pull: { SentFriendRequestList:myId } }
      );
      

      if(!FriendRequestList.includes(friendId)){
         return res.send({ msg: "Rejected Friend Request", FriendRequestList });
      }
      return res.send({ msg: "Unable to delete requests please try again later !!"});
      
      
  } catch (error) {
    return res.status(500).send({ err: error.message });
  }
}

const getMyFriendRequestList = async (req, res) => {
  try {
    // const myId = await jwt.verify(
    //   req.session.userToken,
    //   process.env.JWT_SECRETE
    // ).user._id;
    const myId = req.params.myId
    const { FriendRequestList } = await User.findById(myId);
  
   // if (FriendRequestList.length == 0) return res.send({ friendRequest: [] });

    const getFriendRequest = await Promise.all(
      FriendRequestList.map(async (friendId) => {
        if ((await User.findById(friendId)) == null) {
          await User.updateOne(
            { _id: myId },
            { $pull: { FriendRequestList: friendId } }
          );
        }
        return friendId;
      })
    );
    const friendRequest = await User.find({ _id: { $in: getFriendRequest } });
    return res.status(200).send({ friendRequest });
  } catch (error) {
    return res.status(500).send({ err: error.message });
  }
};

const deleteOneFriend = async ( req, res) => {
     try {
      const { friendId } = req.params;
      const myId = await jwt.verify(
        req.session.userToken,
        process.env.JWT_SECRETE
      ).user._id;
      const { FriendList } = await User.findById(myId)
       await User.updateOne(
        { _id: friendId },
        { $pull: { FriendList: myId } }
      )
       await User.updateOne(
         { _id: myId },
         { $pull: { FriendList: friendId } }
       )
      
      return res.send({ Friends:FriendList })
     } catch (error) {
       return res.send({ msg:error.message })
     }

}
const deleteAllFriends = async (req, res) => {
  try {
    const myId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    ).user._id;
     const user = await User.findById(myId)
     const users = await User.find()
     await Promise.all( users.map( async({ FriendList, _id }) => {
          if(FriendList.includes(myId)){
               await User.updateOne(
                 { _id },
                 { $pull: { FriendList: myId } }
               )
          } 
          return 
     }))

    user.FriendList = []
    await user.save()
   
    return res.send({ Friends:user.FriendList})
  } catch (error) {
    return res.send({ error: error.message })
  }
}

const getAllmySentFriendRequest = async ( req, res) => {
  try {
    const myId = req.params.myId
    //  const myId = await jwt.verify(
    //    req.session.userToken,
    //    process.env.JWT_SECRETE
    //  ).user._id;
     
     const { SentFriendRequestList } = await User.findById(myId)
     const pendingFriendIDs = await Promise.all( SentFriendRequestList.map( async( friendId) => {
         if( await User.findById(friendId) == null ){
           await User.updateOne(
        { _id:myId },
        { $pull: { SentFriendRequestList: friendId } }
      );
         }
         return friendId
     }))
     const pendingFriendList = await User.find({ _id: { $in: pendingFriendIDs } }, { password:0, DepartmentalFees:0, vistorList:0 } )
     return res.status(200).send({ SentFriendRequestList: pendingFriendList })

  } catch (error) {
     return res.send({ msg: error.message });
  }
}

const cancelOneSentFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body
    const myId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    ).user._id;
    
    await User.updateOne(
      { _id: myId },
      { $pull: { SentFriendRequestList: friendId } }
    );
    await User.updateOne(
      { _id: friendId },
      { $pull: { FriendRequestList: myId } }
    );

   const { SentFriendRequestList } = await User.findById(myId)

  return res.status(200).send({ friendId })
  } catch (error) {
    return res.send({ msg: error.message });
  }
}

const cancelAllSentFriendRequest = async (req, res) => {
   try {
       const myId = await jwt.verify(
         req.session.userToken,
         process.env.JWT_SECRETE
       ).user._id;
       const user = await User.findById(myId)
       user.SentFriendRequestList = []
       await user.save()
       return res.status(200).send({ SentFriendRequestList:user.SentFriendRequestList })
   } catch (error) {
     return res.send({ msg: error.message })
   }
}




export {
  getMyFriendList,
  getMyFriendRequestList,
  deleteOneFriend,
  sendFriendOneRequest,
  rejectOneFriendRequest,
  deleteAllFriends,
  cancelOneSentFriendRequest,
  cancelAllSentFriendRequest,
  getAllmySentFriendRequest,
  acceptOneFriendRequest,
};


