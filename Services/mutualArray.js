
function compareArr(arr1, arr2) {
  let isSameGroup = false;
  for (let i = 0; i <= arr1.length - 1; i++) {
    for (let j = 0; j <= arr2.length - 1; j++) {
      if (arr1[i] == arr2[j]) {
        isSameGroup = true;
      }
    }
  }
  return isSameGroup;
}

function getMutual( arr1, arr2){
   let mutualList = [];
   for (let i = 0; i <= arr1.length - 1; i++) {
     for (let j = 0; j <= arr2.length - 1; j++) {
       if (arr1[i] == arr2[j]) {
          mutualList.push(arr1[i])
       }
     }
   }
   return mutualList.length;               
}

function hasChat(ChatList, friendId) {
  let hasFriendId = false;
  ChatList.forEach((chat) => {
    if (chat[friendId]) {
      hasFriendId = true;
    }
  });
  return hasFriendId;
}


 export { compareArr, getMutual, hasChat }