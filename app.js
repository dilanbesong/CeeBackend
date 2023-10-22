
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from "mongoose"
import session from "express-session"
import MongoDBStore from 'connect-mongodb-session'
import { createServer } from "http"
import Auth  from "./routes/auth.js"
import { removeStatus } from './Services/status.js'
import bodyParser from "body-parser";


const connectedUsers = []
//const activeFriends = []
 
const MONGO_URI =  process.env.MONGO_URI;
console.log(MONGO_URI);
mongoose.connect(MONGO_URI)


const app = express() 

app.use(bodyParser.json({ limit:'1gb' }))
app.use(express.json({ limit: "1gb" }))
app.use(bodyParser.urlencoded({ extended:true }))

app.set("port", process.env.PORT || 5000)

const httpServer = createServer(app);



const store = new MongoDBStore(session)({
  uri: MONGO_URI,
  collection: "user_session",
});

app.use(
  session({
    secret: process.env.SESSION_SECRETE,
    saveUninitialized: false,
    resave: false,
    store,
  })
);

app.use(Auth)
setInterval(removeStatus, 100)
dotenv.config();

const corsOptions = {
  origin: process.env.ORIGIN || "http://127.0.0.1:5173",
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  return res.send({ msg: 'hello from server ...'})
})
 
import { Server } from 'socket.io'
import { User } from './model/schema.js'

const io = new Server(httpServer, {
  cors: { origin:'*', methods: ["POST", "GET"] },
});













io.on('connection',  (socket) => {

   socket.on("active",  async (data) => {
    
    if (getUserSocketId(data.recieverId) == undefined ){ 
       console.log('connected...');
       connectedUsers.push({ ...data, socketId: socket.id });
       const activeIDs = connectedUsers.map((user) => user.userId);
       const users = await User.find({ _id: { $in: activeIDs } });
      // socket.emit('online', users)
       socket.emit("status", users);
       return;
    }
      
   });
   
   function getUserSocketId(userId) {

     const user = connectedUsers.find((user) => user.userId == userId)
     if(user){
       return user.socketId;
     }
     return
     
   }

   
   socket.on("send-message", (data) => {

     if (getUserSocketId(data.recieverId)) {
       // check if user is online
       getUserSocketId(data.recieverId);
       const socketId = getUserSocketId(data.recieverId);
       socket.broadcast.to(socketId).emit("recieve-message", data);
       return;
     }
     
   });

   

   socket.on('disconnect', () => {
      let offlineUser = connectedUsers.find(user => user.socketId == socket.id )
      let offlineIndex = connectedUsers.indexOf(offlineUser)
      connectedUsers.splice(offlineIndex, 1)
      console.log('disconnected...');
   })
  
})


httpServer.listen(app.get("port"), function () {
  const port = httpServer.address().port;
  console.log("Running on port : ", port);
});



 
// import { hoursAgo} from './Services/HoursAgo.js'

// console.log(hoursAgo(new Date("2023-08-04T00:51:05.932+00:00")));
// let x = new Buffer.from([1,2,34,23,4,5,6,7,8,9,0])
// console.log(x);




// let obj = {a:1,b:2, c:3, d:4, e:5}
// const objectWithoutUserID = (object, key) => {
//   const {[key]:deletedKey,...otherKeys} = object
//   return otherKeys
// }
// console.log(objectWithoutUserID(obj, 'b'));



































































































// const commentArr = [
//   {
//     id: 1,
//     body: "hell",
//     reply: [
//       {
//         id: 2,
//         body: "good",
//         reply: [
//           {
//             id: 3,
//             body: "sweet",
//             reply: [
//               {
//                 id: 4,
//                 body: "end",
//                 reply: [],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     body: "hell mert",
//     reply: [
//       {
//         id: 5,
//         body: "texas",
//         reply: [
//           {
//             body: "fire",
//             reply: [
//               {
//                 id: 6,
//                 body: "heaven",
//                 reply: [
//                   {
//                     id: 7,
//                     body: "pray",
//                     reply: [],
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   { body: "Dilan", reply: [] },
// ];

// function comments(commentArr) {
//   return commentArr.map((comment) => {
//     log(Object.values(comment));

//     //return comments(comment.reply)
//   });
// }
// comments(commentArr);

































// const user = new ValidateUser(
//   "Diland",
//   "dilan@gmail.com",
//   "2019030187256",
//   "2022",
//   300,
//   "male",
//   "201A90@30187292",
//   "07012345678"
// );

