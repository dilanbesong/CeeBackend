import { User, Chat, Message } from "../model/schema.js"

const displayChatList = async (req, res) =>{
      try {
            const myId = req.params.myId
            const user = await User.findById(myId) 
            
            const FriendIDs = user.ChatList.map((friend) => friend.memberId);
            
            const chatList = await User.find( { _id: { $in: FriendIDs } } )
            return res.status(200).send( { ChatList: chatList } );

      } catch (error) {
          return res.status(500).send( { err: error.message } )        
      }            
}
const getChats = async (req, res) => {
       try {
          const { friendId, myId } = req.params;  
          
          const user = await User.findById(myId)  
          const chatObj = user.ChatList.find(
            (user) => user.memberId == friendId
          ); 
           
          const messages = await Chat.findById(chatObj.chatId)
          
         // const myMessages = await Message.find( { _id : { $in: messageIDs.Chats } } )

          return res.status(200).send( { Conversions:messages.Chats });
       } catch (error) {
          return res.status(500).send({ err: error.message });       
       }           
}

const saveChat = async (req, res) => {
     try { 
           const { senderId, message, recieverId } = req.body
           const msg = new Message({ senderId, message, recieverId }); 
           await msg.save() 

           const user = await User.findById(msg.senderId)
           const friend = await User.findById(msg.recieverId)

            const chatObjForMe = user.ChatList.find(
              (user) => user.memberId == msg.recieverId
            );  
            
            await Chat.updateOne(
              { _id: chatObjForMe.chatId },
              { $push: { Chats: msg } }
            );
            

            const chatObjForFriend = friend.ChatList.find(
              (user) => user.memberId == msg.senderId
            );

            await Chat.updateOne(
              { _id: chatObjForFriend.chatId },
              { $push: { Chats: msg } }
            );

       return res.status(200).send({msg:'Chat has been saved...'})
     } catch (error) {
         return res.status(500).send({ err: error.message });          
     }             
}

const deleteOneChat = async (req, res) => {
     try {
          const { messageId, friendId, myId }  = req.body
          const user = await User.findById(myId)
           const chatObjForMe = user.ChatList.find(
             (user) => user.memberId == friendId
           ); 
            const chatList = await Chat.findById(chatObjForMe.chatId)
            const messageToBeDeleted = chatList.Chats.find(msg => msg._id == messageId)
            const messageIndex = chatList.Chats.indexOf(messageToBeDeleted)
            chatList.Chats.splice(messageIndex, 1)
            await chatList.save()
            // await Chat.updateOne(
            //   { _id: chatObjForMe.chatId },
            //   { $pull: { Chats: messageId } }
            // );

            return res.status(200).send({ messageIndex, isDelete:true });  

     } catch (error) {
        return res.status(500).send({ err: error.message });           
     }             
}

const  pullFriendFromChatlist = async (req, res) => {
    try {
         const { friendId, myId }  = req.body 
         const chatObjForMe = user.ChatList.find(
           (user) => user.memberId == friendId
         ); 
         await Chat.findByIdAndDelete(chatObjForMe.chatId)
         await User.updateOne(
           { _id: myId },
           { $pull: { ChatList: { friendId, chatId:chatObjForMe.chatId} } }
         );
         return res.status(200).send({ friendId, isDelete: true });  
    } catch (error) {
        return res.status(500).send({ err: error.message });           
    }
}

const clearChats = async (req, res) => {
    try {
       const { friendId, myId } = req.body; 
       const user = await User.findById(myId)
       const chatObjForMe = user.ChatList.find(
         (user) => user.memberId == friendId
       ); 
       const chatList = await Chat.findById(chatObjForMe.chatId)   
       chatList.Chats = [] 
       await chatList.save()  
       return res.status(200).send({ friendId, isDelete:true })   
    } catch (error) {
        return res.status(500).send({ err: error.message });           
    }              
}

export { displayChatList, saveChat, getChats, deleteOneChat, pullFriendFromChatlist, clearChats }
