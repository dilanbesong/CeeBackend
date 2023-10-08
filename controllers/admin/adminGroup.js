import { Group, User } from "../../model/schema.js"

const editGroup = async (req, res) => {
   try {
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
      const { groupId } = req.params
      const { groupMembers } = await Group.findById(groupId)
      console.log(groupMembers);
     const memberIDs =  await Promise.all( groupMembers.map( async(memberId) => {
   
         if( await User.findById(memberId) == null){
            await Group.updateOne({ _id:groupId }, { $pull: { groupMembers:memberId } }); 
         }
         return memberId
      }))
     const existingGroupMembers = await User.find({_id: { $in: memberIDs } })
     console.log(existingGroupMembers);
     return res.status(200).send({ groupMembers:existingGroupMembers})
   } catch (error) {
      return res.send({ err: error.message })
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


export {
  editGroup,
  deleteGroup,
  deleteOneMember,
  deleteAllMembers,
  getAllGroupMembers,
  deleteOneGroupRequest,
};