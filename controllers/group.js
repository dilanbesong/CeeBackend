import { Group, User } from "../model/schema.js";

const getMyGroups = async (req, res) => {
  try {
    const myId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    ).user._id

    const { GroupList } = await User.findById(myId)
    const GroupIDs = await Promise.all(
      GroupList.map(async (groupId) => {
        if ((await Group.findById(groupId)) == null) {
          await User.updateOne(
            { _id: myId },
            { $pull: { GroupList: groupId } }
          );
        }
        return groupId;
      })
    );
    const myGroups = await Group.find({ _id: { $in: GroupIDs } });
    return res.status(200).send({ GroupList: myGroups });
  } catch (error) {
    return res.send({ msg: error.message });
  }
};
const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const myId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    ).user._id;

    const { SentGroupRequestList } = await User.findById(myId);
    const { groupRequestList, isApprovedByAdminToJoin } =
      await Group.findById(groupId);

    if (
      SentGroupRequestList.includes(groupId) ||
      groupRequestList.includes(myId)
    )
      return res.send({ msg: "Group Request has already been sent!" })



    if(isApprovedByAdminToJoin){
       await Group.updateOne(
         { _id: groupId },
         { $push: { groupRequestList: myId } }
       )
        await User.updateOne(
          { _id: myId },
          { $push: { SentGroupRequestList: groupId } }
        )
       return res.status(200).send({ SentGroupRequestList })
    }

    await Group.updateOne(
      { _id: groupId },
      { $push: { groupMembers: myId } }
    );
     
    return res.status(200).send({ SentGroupRequestList });
  } catch (error) {
    return res.send({ msg: error.message });
  }
};
const leaveOneGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const myId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    ).user._id
    
    await User.updateOne({ _id: myId }, { $pull: { GroupList: groupId } })
    await Group.updateOne(
      { _id: groupId },
      { $pull: { groupMembers: myId } }
    );
    const { GroupList } = await User.findById(myId);
    return res.status(200).send({ GroupList });
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

const getGroupRequestList = async (req, res) => {
  try {
     const myId = await jwt.verify(
       req.session.userToken,
       process.env.JWT_SECRETE
     ).user._id;
     const { SentGroupRequestList } = await User.findById(myId);
     await Promise.all( SentGroupRequestList.map( async(groupId) => {
       if( await Group.findById(groupId) == null){
         await User.updateOne(
           { _id: myId },
           { $pull: { SentGroupRequestList: groupId } }
         );
         return
       }
     }))
    return res.status(200).send({ SentGroupRequestList })
  } catch (error) {
    return res.send({ msg: error.message });
  }
}

export { getMyGroups, leaveOneGroup, joinGroup, getGroupRequestList };
