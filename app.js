const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("express-handlebars");
const session = require("express-session");
const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const app = express();
const database = require("./database/connection");


// view engine setup
app.engine(
       "hbs",
       hbs.engine({
              extname: "hbs",
              defaultLayout: "layout",
              layoutsDir: "views/layout",
              partialsDir: "views/partials",
       }),
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(
       session({
              secret: "12398djfhdiuy73yyueyhfduoy7reydfd",
              cookie: { maxAge: 6000000 },
       }),
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
console.log(__dirname)
database.connect((err) => {
       if (err) console.log("Database connection failed");
       else console.log("Database connected successfully");
});

app.use(function (req, res, next) {
       res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
       res.header("Expires", "-1");
       res.header("Pragma", "no-cache");
       next();
});

app.use("/", usersRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
       next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
       // set locals, only providing error in development
       res.locals.message = err.message;
       res.locals.error = req.app.get("env") === "development" ? err : {};

       // render the error page
       res.status(err.status || 500);
       res.render("error");
});

module.exports = app;
