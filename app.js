var express    = require("express"),
    bodyparser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user"),
    Admin       = require("./models/admin"),
    // seedDB     = require("./seeds"),
    expressValidator = require('express-validator'),
    multer = require('multer'),
    upload = require("express-fileupload"),
    expressSessiom = require("express-session");

// =====require routes =======
var indexRoutes      = require("./routes/index"),
    usersRoutes      = require("./routes/users"),
    subjectRoutes      = require("./routes/subject"),
    teacherRoutes    = require("./routes/teachers"),
    principalRoutes  = require("./routes/principal"),
    studentRoutes    = require("./routes/student");




var app = express();
app.use(upload());
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine',"ejs");

app.use(express.static(__dirname + "/public"));
app.use(multer({dest: './public/upload/temp'}).single('file'));
// connect with DB
mongoose.connect("mongodb://localhost/SMS");

//==========Passport configuration=============
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000000 } //time in ms
}));

// app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}))



//=====Set current user=====
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// seed the db

// seedDB();

//====calling routes===
// app.get("/",function (req,res) {
//     res.render("student/subject");
// })

app.use("/users", usersRoutes);
app.use("/", indexRoutes);
app.use("/subjects", subjectRoutes);
app.use("/teachers", teacherRoutes);
app.use("/principal", principalRoutes);
app.use("/student", studentRoutes);




app.listen(process.env.PORT, process.env.IP, function () {
    console.log("SMS server has started!")
})