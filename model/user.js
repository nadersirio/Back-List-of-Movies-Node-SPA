const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const tokenPassword = '1309';

const {
  getDatabase,
  saveDatabase,
} = require("../model/index.js");

function createAccount(database) {
  database.accounts = {}
  return saveDatabase(database);
}

function checkPassword(userData) {
  return userData.passwordUser1 === userData.passwordUser2;
}

function checkAccountExist(userData) {
  let userEmailDecoded = false;
  const database = getDatabase();
  for (let account in database.accounts) {
    jwt.verify(database.accounts[account].user, tokenPassword, function(err, decoded) {
      userEmailDecoded = decoded.email;
    })
    if(userEmailDecoded === userData.emailUser) {
      return true;
    }
  }
}

function newAccount(userData) {
  const token = jwt.sign({ email: userData.emailUser, password: userData.passwordUser2 }, tokenPassword);
  const hash = uuidv4();
  const email = userData.emailUser;

  const database = getDatabase() || {};
  const currentAccount = database.accounts[hash] || {}

  database.accounts[hash] = {
    ...currentAccount,
    user: token,
  }
  saveDatabase(database);
  return { hash, email };
}

function validAccount(loginData) {
  const database = getDatabase();
  for (let account in database.accounts) {
    let emailUser = false;
    let passwordUser = false;
    jwt.verify(database.accounts[account].user, tokenPassword, function(err, decoded) {
      emailUser = validEmailLog(decoded.email, loginData.email);
      passwordUser = validPasswordLog(decoded.password, loginData.password);
    });
    const email = loginData.email;
    if (emailUser && passwordUser === true) {
      return { account, email };
    }
  }
}

function validEmailLog(email, loginData){
  return email === loginData;window.location = "/";
}

function validPasswordLog(password, loginData){
  return password === loginData;
}

module.exports = {
  createAccount,
  checkPassword,
  checkAccountExist,
  newAccount,
  validAccount,
}