const path = require("path");

const express = require("express");
const session = require("express-session");
const csrf = require("csurf");

// const mongodbStore = require("connect-mongodb-session");
// We've moved this code to the config.js file.

const sessionConfig = require("./config/session");
// We've moved the session configuration logic into another file called config.js
// So in order to use that logic, we need to require that like this.

const db = require("./data/database");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");

const authMiddleware = require("./middlewares/auth-middleware");
const addCSRFTokenMiddleware = require("./middlewares/csrf-token-middleware");

const mongoDbSessionStore = sessionConfig.createSessionStore(session);
// This is how we execute the createSessionStore function inside the config.js file.

// const MondoDBStore = mongodbStore(session);
// We've moved this code to the config.js file.

const app = express();

// const sessionStore = new MongoDBStore({
//   uri: "mongodb+srv://avishka_indula:p7iGGaREtxbhN3t3@cluster0.ibnu8y4.mongodb.net/test",
//   databaseName: "auth-blog",
//   collection: "sessions",
// });
// We've moved this code to the config.js file.

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// app.use(
//   session({
//     secret: "super-secret",
//     resave: false,
//     saveUninitialized: false,
//     store: sessionStore,
//     cookie: {
//       maxAge: 2 * 24 * 60 * 60 * 1000,
//     },
//   })
// );
// We can move the object inside app.use into the config.js file
// So now we can execute the following line and execute createSessionConfig function
// inside the session.js file in order to do what's we've done above.
app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));

app.use(csrf());

app.use(addCSRFTokenMiddleware);
// This will now add CSRF token to the res.locals field.
// Now we need to access this on header.ejs, post-form.ejs,
// post-item.ejs, login.ejs and signup.ejs using locals.csrfToken

// app.use(async function (req, res, next) {
//   const user = req.session.user;
//   const isAuth = req.session.isAuthenticated;

//   if (!user || !isAuth) {
//     return next();
//   }

//   res.locals.isAuth = isAuth;

//   next();
// });
// We should move this code to auth-middleware file.
app.use(authMiddleware);
// So now we can use it as above.
// As we directly define the middleware function itself, we don't need
// to execute this like => app.use(authMiddleware()); this.
// This function will be executed by express itself when we get incoming requests.
// all other middlewares that come from third party packages
// are actually not middlewares themselves, they are configuration functions.
// Therefor we need to execute those functions. They can also take configuration
// options to. for example => app.use(csrf({}));
// we can pass configuration option into the {} of csrf function.
// Those functions give the actual middleware we need when we "execute" them.

app.use(blogRoutes);
app.use(authRoutes);

app.use(function (error, req, res, next) {
  res.render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
