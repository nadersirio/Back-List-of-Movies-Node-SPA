const { request } = require("express");
const express = require("express");
const serverRouteUser = express.Router();

const {
  getDatabase,
  saveDatabase,
} = require("../model/index.js");

const {
  createAccount,
  checkPassword,
  checkAccountExist,
  newAccount,
  validAccount,
  getCookie,
} = require("../model/user");

serverRouteUser.post("/user", (req, res) => {
  const userData = req.body.userData;

  const database = getDatabase();
  if(!database.accounts) {
    createAccount(database);
  }

  const passwordCheck = checkPassword(userData);
  const accountExist = checkAccountExist(userData);
  if(userData.passwordUser1.length < 4) {
    return res.status(406).json({ error: "Password less than 4 digits."});
  }
  if(!accountExist && passwordCheck) {
    const createAccount = newAccount(userData);
    return res.status(201).json(createAccount).cookie('user', createAccount);
  }
  if(!passwordCheck) {
    return res.status(406).json({ error: "The passwords do not match."});
  }
  res.status(400).json({ error: "E-mail already registered."});
})

serverRouteUser.post("/user/:login", (req, res) => {
  const loginData = req.body.user;
  const validAccountLogin = validAccount(loginData);
  if(validAccountLogin) {
    const hashUser = validAccountLogin;
    return res.status(200).cookie('user', hashUser).json(hashUser);
  }
  res.status(406).json({ error: "Incorrect credentials."});
})

serverRouteUser.delete("/user", (req, res) => {
  res.status(200).clearCookie("user").json({});
})

module.exports = {
  serverRouteUser,
}