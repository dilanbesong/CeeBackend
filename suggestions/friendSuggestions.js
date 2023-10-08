import { User } from "../model/schema.js";
import jwt from "jsonwebtoken";
import { compareArr } from "../Services/mutualArray.js";
import { shuffleArray } from "../Services/shuffle.js";


const friendsSuggestions = async (req, res) => {
  try {
    const myId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    ).user._id;
    const user = await User.findById(myId);

    const suggesstedUsers = await User.find({
      $and: [
        {_id: {  $nin:[ myId ]  }  },
        { _id: { $nin: user.FriendList } },
        { _id: { $nin: user.SentFriendRequestList } },
        { _id: { $nin: user.FriendRequestList } },
      ],
    })

    const getSuggestions = []

    suggesstedUsers.map( user => user._id !== myId ).forEach((suggesstedUser) => {
      if (user.level == suggesstedUser.level) {
        /* @sugguestion base on level */
        getSuggestions.push(suggesstedUser)
      } else if (user.YearOfEntry == suggesstedUser.YearOfEntry) {
        /* @sugg base on year of entry */
        getSuggestions.push(suggesstedUser)
      } else if (user.ModeOfEntry == suggesstedUser.ModeOfEntry) {
        /* @sugg base on Mode of entry */
        getSuggestions.push(suggesstedUser)
      } else if (compareArr(user.GroupList, suggesstedUser.GroupList)) {
        /* @sugg base on similar groups */
        getSuggestions.push(suggesstedUser)
      } else if( compareArr(user.FriendList, suggesstedUser.FriendList )){
        /* @sugg base on mutual friends */
        getSuggestions.push(suggesstedUser)
      } else if(compareArr(user.SearchList, suggesstedUser.SearchList)){
        /* @sugg base on mutual search */
        getSuggestions.push(suggesstedUser)
      }
    });
    const maxSuggestors = 10
    const suggestionSet = new Set(getSuggestions)
    const FriendSuggestions = shuffleArray(
      new Array(...suggestionSet).slice(0, maxSuggestors)
    );

    return res.status(200).send({ FriendSuggestions });
  } catch (error) {
    return res.send({ msg: error.message });
  }
};
 export { friendsSuggestions }