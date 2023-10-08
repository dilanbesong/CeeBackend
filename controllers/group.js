import { Group, Post, User } from "../model/schema.js";
import jwt from "jsonwebtoken";

const createGroup = async ( req, res ) => {
  try {
      const { groupcreator } = req.body
      const newGroup = new Group(req.body)
      await newGroup.save()
      await User.updateOne(
        { _id: groupcreator },
        { $push: { GroupList: newGroup._id } }
      );
      await Group.updateOne( { _id:newGroup._id}, {$push:{ groupMembers:groupcreator  }})
      return res.status(200).send(newGroup)
  } catch (error) {
      return res.send({ msg: error.message });
  }
}

const getGroup = async(req, res) => {
   try {
      const { groupId }= req.params
      const group = await Group.findById(groupId)
      return res.status(200).send(group)
   } catch (error) {
      return res.send({ msg: error.message })
   }
}

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

    const user = await User.findById(myId);
    const group = await Group.findById(groupId);
   
    if (group.groupMembers.includes(myId)){
        await Group.updateOne(
          { _id: groupId },
          { $pull: { groupMembers: myId } }
        );

        await User.updateOne(
          { _id: myId },
          { $pull: { GroupList: groupId } }
        );
        return res.status(200).send(group)
    }

    await Group.updateOne(
      { _id: groupId },
      { $push: { groupMembers: myId } }
    );
   await User.updateOne({ _id: myId }, { $push: { GroupList: groupId } });
   return res.status(200).send(group);
    

  } catch (error) {
    return res.send({ error: error.message });
  }
};


const getGroupPost = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const { groupPost } = await Group.findById(groupId)
        const mapGroupPost = await Promise.all( groupPost.map(async (postId) => {
           if( await Post.findById(postId) == null){
               await Group.updateOne(
                 { _id: groupId },
                 { $pull: { groupPost:postId } }
               );
           }
           return postId
        }))
        const posts = await Post.find({ _id :{ $in: mapGroupPost } } )
        return res.status(200).send(posts)
    } catch (error) {
      return res.status(500).send({ msg: error.message });
    }
}


export { getMyGroups, joinGroup, createGroup, getGroupPost, getGroup };
