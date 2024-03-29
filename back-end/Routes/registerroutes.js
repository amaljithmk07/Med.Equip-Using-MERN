const express = require("express");
const registerroutes = express.Router();
const bcrypt = require("bcryptjs");
const registerDB = require("../models/registerschema");
const volunteerDB = require("../models/volunteerRegisterschema");
const loginDB = require("../models/loginschema");
const uuid = require("uuid");

registerroutes.post("/user", async (req, res) => {
  // console.log('test',req.body.password);

  try {
    const email = req.body.email;
    const lower_email = email.toLowerCase();
    console.log(lower_email);
    const oldUser = await loginDB.findOne({ email: lower_email });
    if (oldUser) {
      return res
        .status(400)
        .json({ success: false, error: true, message: "User already exists" });
    }
    // const { firstName, lastName, email, password, role } = req.body;

    const oldphone = await registerDB.findOne({
      phone_number: req.body.phone_number,
    });
    if (oldphone) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Phone number already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    let log = {
      email: lower_email,
      password: hashedPassword,
      role: 2,
    };
    const result = await loginDB(log).save();

    const uuidv4 = uuid.v4();
    const uuidsliced = uuidv4.slice(0, 4);

    let reg = {
      login_id: result._id,
      name: req.body.name,
      age: req.body.age,
      phone_number: req.body.phone_number,
      user_id: uuidsliced,
    };
    const result2 = await registerDB(reg).save();
    if (result2) {
      res.status(201).json({
        success: true,
        error: false,
        message: "Registration completed",
        details: result2,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong",
      errorMessage: error.message,
    });
    console.log(error);
  }
});

registerroutes.post("/volunteer", async (req, res) => {
  // console.log('test',req.body.password);

  try {
    const email = req.body.email;
    const lower_email = email.toLowerCase();
    const oldUser = await loginDB.findOne({ email: lower_email });
    if (oldUser) {
      return res
        .status(400)
        .json({ success: false, error: true, message: "User already exists" });
    }
    // const { firstName, lastName, email, password, role } = req.body;

    const oldphone = await volunteerDB.findOne({
      phone_number: req.body.phone_number,
    });
    if (oldphone) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Phone number already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    let log = {
      email: lower_email,
      password: hashedPassword,
      role: 3,
    };
    const result = await loginDB(log).save();

    let reg = {
      login_id: result._id,
      // image: req.file ? req.file.filename : null,
      name: req.body.name,
      age: req.body.age,
      phone_number: req.body.phone_number,
      address: req.body.address,
      qualification: req.body.qualification,
    };
    const result2 = await volunteerDB(reg).save();
    if (result2) {
      res.status(201).json({
        success: true,
        error: false,
        message: "Registration completed",
        details: result2,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong",
      errorMessage: error.message,
    });
    console.log(error);
  }
});

module.exports = registerroutes;
