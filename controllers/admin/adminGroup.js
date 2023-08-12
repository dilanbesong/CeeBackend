import { Group, User } from "../../model/schema.js"
import { hasChat } from "../../Services/mutualArray.js"

const createGroup = async (req, res) => {
   try {
       const {
         groupName,
         groupDescription,
         groupProfile,
         groupVisibility,
         isApprovedByAdminToJoin,
         groupcreator
       } = req.body;
       const newGroup = new Group(req.body)
       await newGroup.save()
       return res.status(200).send(newGroup); 
   } catch (error) {
      return res.send({err:error.message})            
   }
}

const editGroup = async (req, res) => {
   try {
       const {
         groupName,
         groupDescription,
         groupProfile,
         groupVisibility,
         isApprovedByAdminToJoin,
         groupcreator,
       } = req.body;
       
        await Group.findByIdAndUpdate(req.body.groupId, req.body)
        const group = await Group(req.body.groupId)   
        return res.status(200).send(group)
   } catch (error) {
        return res.send({ err: error.message })           
   }
}

const deleteGroup = async (req, res) => {
   try {
        const { groupId } = req.body
        const users = await User.find()
        const { groupMembers } = await Group.findById(groupId);
        await Promise.all( users.map( async ({ _id }) => {
         if( groupMembers.includes(_id)){
             await User.updateOne(
               { _id },
               { $pull: { GroupList: group._id } }
             );
         }
         return
        }))
        await Group.findByIdAndDelete(groupId)
       return res.send({ msg:'group has been deleted', isDelete:true }); 
   } catch (error) {
       return res.send({ err: error.message });             
   }
}
const deleteOneMember = async (req, res) => {
   try {
      const { memberId, groupId } = req.body
      await User.updateOne({ _id:memberId }, { $pull: { GroupList: groupId } });
      await Group.updateOne( { _id: groupId }, { $pull: { GroupList: memberId } });
      const { groupMembers } = await Group.findById(groupId)
      return res.status(200).send(groupMembers)
   } catch (error) {
       return res.send({ err: error.message }); 
   }
}
const deleteAllMembers = async (req, res) => {
   try {
      const { groupId } = req.body
      const { groupMembers } = await Group.findById(groupId)
      const users = await User.find()
      await Promise.all( users.map( async({ GroupList, _id }) => {
         if( GroupList.includes(groupId)){
            await User.updateOne( { _id },{ $pull: { GroupList: groupId } } );
         }
         return
      }))
      return res.status(200).send(groupMembers)
   } catch (error) {
     return res.send({ err: error.message });
   }
}

const getAllGroupMembers = async(req, res) => {
   try {
      const { groupId } = req.body
      const { groupMembers } = await Group.findById(groupId)

     const memberIDs =  await Promise.all( groupMembers.map( async(memberId) => {
   
         if( await User.findById(memberId) == null){
            await Group.updateOne({ _id:groupId }, { $pull: { groupMembers:memberId } }); 
         }
         return memberId
      }))
     const existingGroupMembers = await User.find({_id: { $in: memberIDs } })
     return res.status(200).send({ groupMembers:existingGroupMembers})
   } catch (error) {
      return res.send({ err: error.message })
   }
}

const getGroupRequestList = async (req, res) => {
   try {
      const { groupId } = req.body;
      const { groupRequestList } = await Group.findById(groupId);
      const memberIDs = await Promise.all(
        groupRequestList.map(async (memberId) => {
          if ((await User.findById(memberId)) == null) {
            await Group.updateOne(
              { _id: groupId },
              { $pull: { groupMembers: memberId } }
            );
          }
          return memberId;
        })
      );
      const existingGroupMembers = await User.find({ _id: { $in: memberIDs } })
      return res.status(200).send({ GroupList:existingGroupMembers })
   } catch (error) {
      return res.send({ err: error.message })
   }
}

const acceptOneNewMember = async (req, res) => {
   try {
     const { memberId, groupId } = req.body;
     const { groupMembers, ChatList } = await Group.findById(memberId);
     const member = await Group.findById(memberId);
     await Group.updateOne(
       { _id: groupId },
       { $pull: { groupRequestList: memberId } }
     );
     await Group.updateOne(
       { _id: groupId },
       { $push: { groupMembers: memberId } }
     );
     await User.updateOne(
       { _id: memberId },
       { $pull: { SentGroupRequestList: groupId } }
     );

     if (hasChat(member.ChatList, memberId))return res.status(200).send({ groupMembers })
     //@ checking if group id is in member(user) chat list
     await User.updateOne(
       { _id: memberId },
       { $push: { ChatList: { [groupId]: { Messages: [] } } } } // creatx a message object for new friend
     );

     if (hasChat(ChatList, memberId))
       return res.status(200).send({ groupMembers });
     //@ checking if member(user) id is in group chat list
     await Group.updateOne(
       { _id: groupId },
       { $push: { ChatList: { [memberId]: { Messages: [] } } } } // creatx a message object for new friend
     );

     return res.status(200).send({ groupMembers });
   } catch (error) {
     return res.send({ err: error.message });
   }
}

const deleteOneGroupRequest = async (req, res) => {
   try {
      const { memberId, groupId } = req.body
      const { groupRequestList } = await Group.findById(memberId);
      await User.updateOne(
        { _id: memberId },
        { $pull: { SentGroupRequestList: groupId } }
      );
      await Group.updateOne(
        { _id: groupId },
        { $pull: { groupRequestList: memberId } }
      );
      return res.status(200).send({ groupRequestList })
   } catch (error) {
      return res.send({ err: error.message })
   }
}

const deleteAllGroupRequest = async (req, res) => {
   try {
      const { groupId } = req.body
      const users = await User.find()
      const { groupRequestList } = await Group.findById(groupId)
      await Promise.all( users.map( async ({ SentGroupRequestList, _id}) => {
         if(SentGroupRequestList.includes(_id)) {
            await User.updateOne(
              { _id },
              { $pull: { SentGroupRequestList: groupId } }
            );
         }
         return
      } ) )
      return res.status(200).send( groupRequestList)
   } catch (error) {
     return res.send({ err: error.message });
   }
}
export {
  createGroup,
  editGroup,
  deleteGroup,
  deleteOneMember,
  deleteAllMembers,
  getAllGroupMembers,
  getGroupRequestList,
  deleteOneGroupRequest,
  deleteAllGroupRequest,
  acceptOneNewMember,
};