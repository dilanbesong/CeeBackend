import { Group, User } from "../model/schema.js";
import jwt from "jsonwebtoken";
import { compareArr } from "../Services/mutualArray.js";
import { shuffleArray } from "../Services/shuffle.js";

const groupSuggestions = async ( req, res ) => {
  try {
      const myId = await jwt.verify(
        req.session.userToken,
        process.env.JWT_SECRETE
      ).user._id;
      const user = await User.findById(myId);
      const suggestedGroups = await Group.find({
        $or: [
          { _id: { $nin: user.GroupList } },
          { _id: { $nin: user.SentGroupRequestList } },
        ],
      })
      const getSuggestions = [];
      suggestedGroups.forEach( group => {
         if( user.searchList == group.groupName) {
           /* @sugg base on group search */
           getSuggestions.push(group);
         }else if(compareArr(user.FriendList, group.groupMembers)){
           /* @sugg base on my Friends */
           getSuggestions.push(group);
         }else if(compareArr(user.FriendRequestList, group.groupMembers)){
           /* @sugg base on those who sent me a friend Request */
           getSuggestions.push(group);
         }else if( compareArr(user.SentFriendRequestList, group.groupMembers) ){
           /* @sugg base on those i have sent a Friend who are group members */
           getSuggestions.push(group);
         }       
      })

      const maxSuggestors = 10
    const suggestionSet = new Set(getSuggestions)
    const GroupSuggestions = shuffleArray(
      new Array(...suggestionSet).slice(0, maxSuggestors) )

      return res.status(200).send({ GroupSuggestions })

  } catch (error) {
     return res.send({msg:error.message})             
  }
}

export { groupSuggestions }