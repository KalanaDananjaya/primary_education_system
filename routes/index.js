var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Student = require("../models/student");
var Teacher = require("../models/teacher");
var Principal = require("../models/principal");
var Admin = require("../models/admin");
var AdminNotice = require("../models/adminNotice");
var Announcement = require("../models/announcement");



router.get("/",function (req,res) {
    res.render("login");
})

router.get("/dashbord", isLoggedIn, function (req,res) {
    if(req.user.type==="admin"){
        Admin.findOne({"authent.id":req.user._id},function (err,admin) {
            if(err){
                console.log(err);
            }else {
                Announcement.findOne({},function (err,notice) {
                    if(err){
                        console.log(err);
                    }else {
                        console.log(notice);
                        var newNotice = {
                            // topic:notice.topic,
                            // notice:notice.notice
                        }
                        console.log(newNotice);
                        res.render("admin/index",{notice:notice});
                        console.log(admin);
                    }
                })


            }
        })
    }else if(req.user.type==="Student"){
        Student.findOne({"authent.id":req.user._id},function (err,student) {
            if(err){
                console.log(err);
            }else {
                Announcement.findOne({},function (err,notice) {
                    if(err){
                        console.log(err);
                    }else {
                        res.render("student/index",{notice:notice});
                    }
                })

            }
        })
    }else if(req.user.type==="principal"){
        Principal.findOne({"authent.id":req.user._id},function (err,principal) {
            if(err){
                console.log(err);
            }else {
                Announcement.findOne({},function (err,notice) {
                    if(err){
                        console.log(err);
                    }else {
                        res.render("principal/index",{notice:notice});
                    }
                })
            }
        })
    }else if(req.user.type==="Teacher"){
        Teacher.findOne({"authent.id":req.user._id},function (err,teacher) {
            if(err){
                console.log(err);
            }else {
                Announcement.findOne({},function (err,notice) {
                    if(err){
                        console.log(err);
                    }else {
                        res.render("teacher/index",{notice:notice});
                    }
                })

            }
        })
    }

});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/dashbord",
        failureRedirect: "/"
    }), function(req, res){
});

router.get("/announcement",isLoggedIn,function (req,res) {
    res.render("principal/announcements");
})

router.post("/announcement",isLoggedIn,function (req,res) {
    Announcement.remove({},function (err) {
        if(err){
            console.log(err);
        }else{
            Announcement.create({
                notice:req.body.announcement
            },function (err,announcement) {
                if(err){
                    console.log(err);
                }else{
                    res.redirect("/announcement/view")
                }
            })
        }
    })

})

router.get("/announcement/view",isLoggedIn,function (req,res) {
    Announcement.findOne({},function (err,notice) {
        if(err){
            console.log(err);
        }else {
            res.render("principal/viewAnnouncements",{notice:notice});
        }

    })
})

router.get("*/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

module.exports = router;
