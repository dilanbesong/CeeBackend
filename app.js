
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from "mongoose"
import session from "express-session"
import MongoDBStore from 'connect-mongodb-session'
import { createServer } from "http"
import Auth  from "./routes/auth.js"
import { removeStatus } from './Services/status.js'
import { log } from 'console'

const MONGO_URI = "mongodb://localhost:27017/CEEDB" || process.env.MONGO_URI;
mongoose.connect(MONGO_URI)


const app = express()

app.set("port", process.env.PORT || 5000);

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

app.use(cors());
app.use(Auth)
//setInterval(removeStatus, 100)
dotenv.config();

app.get('/', (req, res) => {
  return res.send({ msg: 'hello from server ...'})
})


httpServer.listen(app.get("port"), function () {
  const port = httpServer.address().port;
  console.log("Running on port : ", port);
});

import { hoursAgo} from './Services/HoursAgo.js'

console.log(hoursAgo(new Date("2023-08-04T00:51:05.932+00:00")));











































































































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

