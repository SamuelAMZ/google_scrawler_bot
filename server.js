const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const timeout = require("connect-timeout");

// app routes
const NewSearchRoute = require("./api/routes/appRoutes/NewSearch");
const SingleSearchRoute = require("./api/routes/appRoutes/SingleSearch");
const FilterResultRoute = require("./api/routes/appRoutes/FIlterResult");
const HomeAnalytics = require("./api/routes/appRoutes/HomeAnalyticsRoute");
const PaginationRoute = require("./api/routes/appRoutes/Pagination");
const VisiteEachLinkRoute = require("./api/routes/appRoutes/VisitEachLinkRoute");
const RemoveSearchRoute = require("./api/routes/appRoutes/RemoveSearch");
const DownloadCsvRoute = require("./api/routes/appRoutes/DownloadCsv");
const NewDomainRoute = require("./api/routes/appRoutes/AddNewDomain");
const RemoveTableItemRoute = require("./api/routes/appRoutes/RemoveTableItem");
const NewUrlRoute = require("./api/routes/appRoutes/AddNewUrl");
const ReturnDefaultDomainsAndUrlsRoute = require("./api/routes/appRoutes/ReturnDefaultDomainsAndUrls");
const UserdetailsRoute = require("./api/routes/appRoutes/Userdetails");
const UserVerificationRoute = require("./api/routes/appRoutes/UserVerification");
const UserTakedownRequestsRoute = require("./api/routes/appRoutes/UserTakedownRequests");
const UserUrlsAndDomainsRoute = require("./api/routes/appRoutes/UserUrlsAndDomains");

// auth routes
const newAccountRoute = require("./api/routes/authRoutes/NewAccount");
const LoginRoute = require("./api/routes/authRoutes/LoginRoute");
const isLoginRoute = require("./api/routes/authRoutes/isLogin");
const LogoutRoute = require("./api/routes/authRoutes/Logout");

// timeout
app.use(timeout(600000));
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

/*   
    @desc: visit each link one by one check for video and keyword present
    @method: POST
    @privacy: public
    @endpoint: /api/visit-each-link
*/
app.use("/api/visit-each-link", VisiteEachLinkRoute);

/*   
    @desc: remove single search
    @method: POST
    @privacy: public
    @endpoint: /api/remove-single-earch
*/
app.use("/api/remove-single-earch", RemoveSearchRoute);

/*   
    @desc: download csv
    @method: POST
    @privacy: public
    @endpoint: /api/download-csv
*/
app.use("/api/download-csv", DownloadCsvRoute);

/*   
    @desc: add new domain
    @method: POST
    @privacy: public
    @endpoint: /api/new-domain
*/
app.use("/api/new-domain", NewDomainRoute);

/*   
    @desc: remove domain
    @method: POST
    @privacy: public
    @endpoint: /api/remove-table-item
*/
app.use("/api/remove-table-item", RemoveTableItemRoute);

/*   
    @desc: add url
    @method: POST
    @privacy: public
    @endpoint: /api/new-url
*/
app.use("/api/new-url", NewUrlRoute);

/*   
    @desc: add url
    @method: POST
    @privacy: public
    @endpoint: /api/defaults
*/
app.use("/api/defaults", ReturnDefaultDomainsAndUrlsRoute);

/*   
    @desc: single app user detail
    @method: POST
    @privacy: public
    @endpoint: /api/user-info
*/
app.use("/api/user-info", UserdetailsRoute);

/*   
    @desc: single app user verification url
    @method: POST
    @privacy: public
    @endpoint: /api/user-verification-url
*/
app.use("/api/user-verification-url", UserVerificationRoute);

/*   
    @desc: user leaks reaport
    @method: POST
    @privacy: public
    @endpoint: /api/user-leaks
*/
app.use("/api/user-leaks", UserTakedownRequestsRoute);

/*   
    @desc: user urls qnd domqins
    @method: POST
    @privacy: public
    @endpoint: /api/user-urls-domains
*/
app.use("/api/user-urls-domains", UserUrlsAndDomainsRoute);

app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);
