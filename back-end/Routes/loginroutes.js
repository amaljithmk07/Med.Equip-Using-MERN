const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginSchema = require("../models/loginschema");
const register = require("../models/registerschema");
const VolunteerDB = require("../models/volunteerRegisterschema");
const Checkauth = require("../middle-ware/Checkauth");
const { default: mongoose } = require("mongoose");
const loginroutes = express.Router();
require("dotenv").config();

loginroutes.post("/", async (req, res) => {
  // const { email, password } = req.body;

  try {
    console.log(req.body.password);
    console.log(req.body.email);
    const email = req.body.email;
    const loweremail = email.toLowerCase();

    if (loweremail && req.body.password) {
      const oldUser = await loginSchema.findOne({ email: loweremail });
      if (!oldUser)
        return res.status(400).json({
          success: false,
          error: true,
          message: "Email doesn't Exist",
        });

      if (oldUser.role == 3) {
        const loginId = new mongoose.Types.ObjectId(oldUser._id);
        const oldvolunteer = await VolunteerDB.findOne({ login_id: loginId });
        const isapproved = oldvolunteer.status;
        if (isapproved !== "Approved") {
          return res.status(400).json({
            success: false,
            error: true,
            message: " Request not approved",
          });
        }
      }
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        oldUser.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({
          success: false,
          error: true,
          message: "Incorrect password",
        });
      // console.log('oldUser',oldUser);
      const token = jwt.sign(
        {
          userId: oldUser._id,
          userRole: oldUser.role,
          userEmail: oldUser.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        success: true,
        error: false,
        token: token,
        expiresIn: 3600,
        loginId: oldUser._id,
        userRole: oldUser.role,
        email: oldUser.email,
        data: "Login Successful",
      });

      // console.log("token:", token);
      // console.log("Role:", userRole);
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "All fields are required!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong",
      message: error.message,
    });
  }
});

//Check UUID

loginroutes.post("/uuidverify", Checkauth, async (req, res) => {
  try {
    const userid = req.userData.userId;
    console.log(userid);
    const userdata = await register.findOne({
      login_id: userid,
    });
    const uuid = userdata.user_id;
    console.log("UUID :", uuid);
    console.log(typeof uuid);
    console.log("front", req.body.user_id);
    console.log("frontype", typeof req.body.user_id);
    if (uuid === req.body.user_id) {
      res.status(200).json({
        success: true,
        error: false,
        message: "Success",
        // data: uuid,
        uuid: req.body.user_id,
      });
    } else {
      res.status(400).json({
        success: false,
        error: true,
        message: "Wrong UUID ",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
      errMessage: err.message,
    });
  }
});

//Auth Timeout

loginroutes.get("/authtime", Checkauth, (req, res) => {
  try {
    if (Checkauth) {
      return res.status(200).json({
        success: true,
        error: false,
        message: "Session Started",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Session Time Out",
      errMessage: err.message,
    });
  }
});

module.exports = loginroutes;
