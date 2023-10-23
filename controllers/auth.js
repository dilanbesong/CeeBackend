import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { ObjectId } from "mongoose";
import { User } from "../model/schema.js";
import { SaveToCookie } from "../Services/saveCookie.js";
import Active from "./active.js";


const router = express();
const httpServer = createServer(router);

const register = async (req, res) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(req.body.password, salt);

    req.body.password = encryptedPassword
    const newUser = new User(req.body);
    await newUser.save();

    const userToken = jwt.sign({ user: newUser }, process.env.JWT_SECRETE, {
      expiresIn: "24h",
    });
    // SaveToCookie(req, userToken)
    // Active(httpServer, newUser._id)
    return res.send({ msg: "home", userToken });
  } catch (error) {
    return res.send({ err: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });
    if (user == null)
      return res.send({
        msg: "Please visit the cee department to get a free account",
      });
    if (user.isBlocked)
      return res.send({ msg: "Please visit the school admin " });
    if (await bcrypt.compare(password, user.password)) {
      const userToken = jwt.sign({ user }, process.env.JWT_SECRETE, {
        expiresIn: "24h",
      });
       req.session.isloggedIn = true
      SaveToCookie(req, userToken);
     // Active(httpServer, user._id);
      return res.send({ msg: "User successfully loggedIn", user });
    }
  } catch (error) {
    return res.send({ err: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = await jwt.verify(
      req.session.userToken,
      process.env.JWT_SECRETE
    ).user._id;
    if (userId == null)
      return res.status(500).send({ msg: "You are not logged in !!" });

    const user = await User.findById(userId, { _id: 0, password: 0 }); // get every user field except the _id
    return res.status(200).send(user);
  } catch (error) {
    return res.send({ err: error.message });
  }
};

const logOut = (req, res) => {
  try {
    req.session.cookie.maxAge = 0;
    req.session.isloggedIn = false;
    req.session.userToken = null;
    req.session.cookie.expires = false;
    return res.send({ isLoggout: true });
  } catch (error) {
    return res.send({ err: error.message });
  }
};

const editProfile = async (req, res) => {
  const userId = await jwt.verify(
    req.session.userToken,
    process.env.JWT_SECRETE
  ).user._id;

  try {
     const user = await User.findByIdAndUpdate(userId, req.body)
     return res.status(200).send({ msg: "Profile has been updated...", user });
  } catch (error) {
    return res.send({ err: error.message });
  }
}

const getUserById = async (req, res) => {
  try {
    const userId =  req.params.userId 
    const user = await User.findById(userId)
    return res.status(200).send(user)
  } catch (error) {
    return res.send({ err: error.message });
  }
}

export { register, login, logOut, getUser, editProfile, getUserById };

// {
//      "username":"DilanBesong",
//      "email":"dilan@gmail.com",
//      "regNumber":"2019030187256",
//      "YearOfEntry":"2022",
//      "level":300,
//      "sex":"male",
//      "password":"201A90@30187292",
//      "PhoneNumber":"08060971826"
// }

//const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
// bcrypt.compareSync(myPlaintextPassword, hash);
