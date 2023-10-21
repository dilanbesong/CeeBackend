import express from "express";
import bodyParser from "body-parser";
import { isExist, validateCredencials } from "../middlewears/validateuser.js"
import { register, login, getUser, logOut, editProfile, getUserById } from "../controllers/auth.js"
import { getResetCode, resetPassword } from "../controllers/resetPassword.js"
import { hasCode } from "../middlewears/hasResetCode.js"
import friends  from './friends.js'
import chat from './chat.js'
import groups from './groups.js'
import notifications from './notification.js'
import payments from './payment.js'
import posts from './post.js'
import adminGroup from "./adminGroup.js"
import adminPanel from "./adminPanel.js"
import comment from './comments.js'
import { isAuth } from "../middlewears/isAuth.js";
const { urlencoded, json } = bodyParser;

const router = express.Router()
router.use(json());

//support parsing of application/x-www-form-urlencoded post data
router.use(urlencoded({ extended: true }));

router.use(friends)
router.use(groups)
router.use(notifications)
router.use('/chat', chat)
router.use('/payment',payments)
router.use('/post',posts)
router.use('/comment', comment)
router.use('/group',adminGroup)
router.use('/adminPanel', adminPanel)

router
  .post("/register", validateCredencials, isExist, register)
  .post("/login", login)
  .get('/logout', logOut)
  .post("/getResetcode", getResetCode)
  .put('/editProfile',  editProfile )
  .put("/resetPassword", hasCode, resetPassword)
  .get("/user", getUser)
  .get('/user/:userId',  getUserById)


export default router;

// {
//     "username": "Diland",
//     "email": "dilan@gmail.com",
//     "regNumber": "2019030187256",
//     "YearOfEntry": "2022",
//     "level": 300,
//     "sex": "male",
//     "password": "201A90@30187292",
//     "PhoneNumber": "07012345678"
// }