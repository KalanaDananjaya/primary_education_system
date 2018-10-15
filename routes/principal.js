var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Student = require("../models/student");
var Teacher = require("../models/teacher");
var Principal = require("../models/principal");
var Admin = require("../models/admin");
var Leave = require("../models/leave");
var Attendence = require("../models/attendence");
var Assignment = require("../models/assignment");
var fs = require('fs');
var path = require('path');
var LeaveApplication = require("../models/leave");
var Announcement = require("../models/announcement");


router.get("/view/student", isLoggedIn, function (req,res) {
    Student.find({},function (err,students) {
        if(err){
            console.log(err);
        }else {
            res.render("principal/students",{students:students});
        }
    })
});

router.get("/view/teacher", isLoggedIn, function (req,res) {
    Teacher.find({},function (err,teacher) {
        if(err){
            console.log(err);
        }else {
            res.render("principal/Teachers",{students:teacher});
        }
    })
});

router.get("/leave",isLoggedIn,function (req,res) {
    Leave.find({status:false},function (err,leave) {
        if(err){
            console.log(err);
        }else{
            res.render("principal/leaveList",{leave:leave});
        }
    })

})

router.get("/leave/:username",isLoggedIn,function (req,res) {
    Leave.findOne({username:req.params.username},function (err,leaveApllication) {
        if(err){
            console.log(err);
        }else {
            res.render("principal/listForm",{application:leaveApllication});
        }
    })
})

router.get("/leave/approve/:username",isLoggedIn,function (req,res) {
    Leave.findOne({username:req.params.username},function (err,leaveApllication) {
        if(err){
            console.log(err);
        }else {
            leaveApllication.status=true;
            leaveApllication.save();
            res.redirect("/principal/leave");
        }
    })
})

router.get("/leave/disapprove/:username",isLoggedIn,function (req,res) {
    Leave.remove({username:req.params.username},function (err) {
        if(err){
            console.log(err);
        }else {

            res.redirect("/principal/leave");
        }
    })
})

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
                    res.redirect("/principal/view/announcement")
                }
            })
        }
    })

})

router.get("/view/announcement",isLoggedIn,function (req,res) {
    Announcement.findOne({},function (err,notice) {
        if(err){
            console.log(err);
        }else {
            res.render("principal/viewAnnouncements",{notice:notice});
        }

    })
})


router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()&& (req.user.type=='principal')){
        return next();
    }
    res.redirect("/");
}





module.exports = router;