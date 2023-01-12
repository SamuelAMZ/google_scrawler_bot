const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// routes
const NewSearchRoute = require("./api/routes/NewSearch");
const SingleSearchRoute = require("./api/routes/SingleSearch");
const FilterResultRoute = require("./api/routes/FIlterResult");
const HomeAnalytics = require("./api/routes/HomeAnalyticsRoute");
const PaginationRoute = require("./api/routes/Pagination");
const newAccountRoute = require("./api/routes/NewAccount");
const LoginRoute = require("./api/routes/LoginRoute");
const isLoginRoute = require("./api/routes/isLogin");
const LogoutRoute = require("./api/routes/Logout");

// body parsing
app.use(express.json());
// cookies
app.use(cookieParser());
// cors
app.use(
  cors({
    origin: process.env.DOMAIN,
    credentials: true,
    optionSuccessStatus: 200,
  })
);

// connect mongoose
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to db");
  }
});

// set headers globally
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": process.env.DOMAIN,
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  });
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("Server up");
});

/*   
    @desc: new search
    @method: POST
    @privacy: public
    @endpoint: /api/new
*/
app.use("/api/new", NewSearchRoute);

/*   
    @desc: single search page
    @method: POST
    @privacy: public
    @endpoint: /api/singleSearch
*/
app.use("/api/singleSearch", SingleSearchRoute);

/*   
    @desc: single search page
    @method: POST
    @privacy: public
    @endpoint: /api/filterResult
*/
app.use("/api/filterResult", FilterResultRoute);

/*   
    @desc: home analytics
    @method: POST
    @privacy: public
    @endpoint: /api/homeAnalytics
*/
app.use("/api/homeAnalytics", HomeAnalytics);

/*   
    @desc: pagination
    @method: POST
    @privacy: public
    @endpoint: /api/pagination
*/
app.use("/api/pagination", PaginationRoute);

/*   
    @desc: new account
    @method: POST
    @privacy: public
    @endpoint: /api/new-account
*/
app.use("/api/new-account", newAccountRoute);

/*   
    @desc: login
    @method: POST
    @privacy: public
    @endpoint: /api/login
*/
app.use("/api/login", LoginRoute);

/*   
    @desc: check if login
    @method: GET
    @privacy: public
    @endpoint: /api/is-login
*/
app.use("/api/is-login", isLoginRoute);

/*   
    @desc: logout
    @method: GET
    @privacy: public
    @endpoint: /api/logout
*/
app.use("/api/logout", LogoutRoute);

app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);
