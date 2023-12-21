const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const router = require('./Routers/router');
const adminRouter = require('./Routers/adminrouter');

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

// User session configuration
app.use('/',session({
  name: 'userSession',
  secret: 'user-session-secret',
  resave: false,
  saveUninitialized: true
}));

// Admin session configuration
app.use('/admin', session({
  name: 'adminSession',
  secret: 'admin-session-secret',
  resave: false,
  saveUninitialized: true
}));

// Static middleware after session configuration
app.use(express.static(path.join(__dirname, 'Static')));

app.use("/", router);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("User Server http://localhost:3000 Admin Server http://localhost:3000/admin");
});

module.exports = app;
