const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const server = express();
const bodyParser = require('body-parser');

const { serverRouteMovie } = require("./controller/movie.js");
const { serverRouteUser } = require("./controller/user.js");

server.use(cors())
server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser())
server.use(serverRouteMovie);
server.use(serverRouteUser);

server.listen(3000, () => {
});