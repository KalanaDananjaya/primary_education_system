var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Student = require("../models/student");
var Teacher = require("../models/teacher");
var Principal = require("../models/principal");
var Admin = require("../models/admin");
var CourseMaterial = require("../models/courseMaterial");
var fileupload=require('express-fileupload');
var fs = require('fs');
var path = require('path');
var Announcement = require("../models/announcement");




router.get("/science/assignment", isLoggedIn, function (req,res) {
    res.render("student/assignment");
});

router.get("/science/assignment/submission", isLoggedIn, function (req,res) {
    res.render("student/submission");
});
router.get("/science/newsForum", isLoggedIn, function (req,res) {
    res.render("student/newsForum");
});
router.get("/science/lectureSlides", isLoggedIn, function (req,res) {
    res.render("student/lectureSlides");
});

router.get("/courseMaterials", isLoggedIn, function (req,res) {
    res.render("teacher/addCourseMaterials");
});

router.post('/upload',isLoggedIn,function(req,res){
    // req.checkBody('name','startdate is required').notEmpty();
    // req.checkBody('description','enddate is required').notEmpty();
    // req.checkBody('duedate','reason is required').notEmpty();
    // req.checkBody('time','startdate is required').notEmpty();


    // Get Errors
    var errors = req.validationErrors();

    if(errors){
        // res.render("Error", {
        //     errors:errors
        // });
    }

    else{
        var course = new CourseMaterial();

        console.log('file info: ', req.file);
        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
            imgUrl = '';

        for (var i = 0; i < 6; i += 1) {
            imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        var tempPath = req.file.path, //<line 55 error
            ext = path.extname(req.file.originalname).toLowerCase(),
            targetPath = path.resolve('./public/upload/' + imgUrl + ext);

        if (ext === '.png' || ext === '.jpg' || ext === '.doc' || ext === '.pdf' || ext === '.pptx' || ext === '.xlsx' || ext === '.docx' || ext === '.txt') {
            fs.rename(tempPath, targetPath, function (err) {
                if (err) throw err;
                console.log("Upload completed!");
            });
        } else {
            fs.unlink(tempPath, function () {
                if (err) throw err;
                res.json(500, {error: 'Only image files are allowed.'});
            });
        }


        course.subject = req.body.subject;
        course.date    = req.body.date;
        course.fileNameame =targetPath ;


        assignment.save(function(err){
            if(err){
                console.log(err);
                return;
            } else {
                res.redirect('/subjects/courseMaterials/upload');
            }
        });
    }
});


router.get("/notice",isLoggedIn,function (req,res) {
    Announcement.findOne({},function (err,notice) {
        if(err){
            console.log(err);
        }else {
            res.render("principal/viewAnnouncements",{notice:notice});
        }

    })
})

router.get("/:subject", isLoggedIn, function (req,res) {
    var subject = {
        name:req.params.subject
    }
    res.render("student/subject",{subject:subject});
});

// router.get("/timetable",function (req,res) {
//     res.render("student/timetable");
// })

router.get("/logout", function(req, res){
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