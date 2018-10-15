var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Student = require("../models/student");
var Teacher = require("../models/teacher");
var Principal = require("../models/principal");
var Admin = require("../models/admin");
var Class = require("../models/class");
var AdminNotice = require("../models/adminNotice");
var Leave = require("../models/leave");


router.get("/new/student", isLoggedIn, function (req,res) {
    res.render("admin/newStudent");
});

router.get("/new/teacher", isLoggedIn, function (req,res) {
    res.render("admin/createTeacher");
});

router.post("/student", isLoggedIn, function (req,res) {
    // res.send(req.body);
    var index = 0;
    Class.findOne({"name":req.body.class,"grade":req.body.grade},function (err,newClass) {
        if(err){
            console.log(err);
        }else {
            if(!newClass){
                Class.create({
                    name : req.body.class,
                    grade: req.body.grade,
                    noOfStudents: 1

                },function (err,clas) {
                    if(err){
                        console.log(err);
                    }else {
                        console.log(clas);
                        console.log("New class created!!");
                        index = 1;
                        var newindex=String(index);
                        var userID = req.body.grade+"00"+newindex+req.body.class;
                        var newUser = new User({username:userID, type:req.body.type});
                        User.register(newUser,"password",function (err,user) {
                            if(err){
                                console.log(err);
                                return res.redirect("/users/new/student");
                            }else {
                                if(req.body.type==="Student"){
                                    console.log("Hey!!!!");
                                    var newStudent = new Student({
                                        firstName:req.body.firstName,
                                        secondName:req.body.secondName,
                                        birthday:req.body.date,
                                        address:req.body.address
                                    })
                                    Student.create(newStudent,function (err,student) {
                                        if(err){
                                            console.log(err);
                                        }else {
                                            student.authent.id=user._id;
                                            student.username=user.username;
                                            student.class.id = clas._id;
                                            student.save();
                                            console.log("Student created!!!");
                                            console.log(student);
                                            res.redirect("/users/new/student");
                                        }
                                    })

                                }
                            }
                        })
                    }
                })
            }else {
                newClass.noOfStudents=newClass.noOfStudents+1;
                newClass.save();
                console.log(newClass);
                index = newClass.noOfStudents;
                // console.log(index);
                var newindex=String(index);
                var userID = req.body.grade+"00"+newindex+req.body.class;
                var newUser = new User({username:userID, type:req.body.type});
                User.register(newUser,"password",function (err,user) {
                    if(err){
                        console.log(err);
                        return res.redirect("/users/new/student");
                    }else {
                        if(req.body.type==="Student"){
                            console.log("Hey!!!!");
                            var newStudent = new Student({
                                firstName:req.body.firstName,
                                secondName:req.body.secondName,
                                birthday:req.body.date,
                                address:req.body.address
                            })
                            Student.create(newStudent,function (err,student) {
                                if(err){
                                    console.log(err);
                                }else {
                                    student.authent.id=user._id;
                                    student.username=user.username;
                                    student.class.id=newClass._id;
                                    student.save();
                                    console.log("Student created!!!");
                                    console.log(student);
                                    res.redirect("/users/new/student");
                                }
                            })

                        }
                    }
                })
            }
        }
    })

});

router.post("/teacher", isLoggedIn, function (req,res) {
    // res.send(req.body);
    console.log(req.body.classTeacher);
    if(req.body.classTeacher=="Yes"){
        Class.findOne({"name":req.body.class,"grade":req.body.grade},function (err,newClass) {
            if(err){
                console.log(err);
            }else {
                if(!newClass){
                    Class.create({
                        name : req.body.class,
                        grade: req.body.grade

                    },function (err,clas) {
                        if(err){
                            console.log(err);
                        }else {
                            console.log(clas);
                            console.log("New class created!!");
                            var newUser = new User({username:req.body.username, type:req.body.type});
                            User.register(newUser,"password",function (err,user) {
                                if(err){
                                    console.log(err);
                                    return res.redirect("/users/new/teacher");
                                }else {
                                    if(req.body.type==="Teacher"){
                                        console.log("Hey!!!! from Teacher");
                                        var newTeacher = new Teacher({
                                            firstName:req.body.firstName,
                                            secondName:req.body.secondName,
                                            birthday:req.body.date,
                                            address:req.body.address,
                                            class : req.body.class,
                                            grade : req.body.grade,
                                            subject : req.body.subject
                                        })
                                        Student.create(newTeacher,function (err,teacher) {
                                            if(err){
                                                console.log(err);
                                            }else {
                                                teacher.authent.id=user._id;
                                                teacher.username=user.username;
                                                teacher.isClassTeacher = true;
                                                teacher.save();
                                                clas.classTeacher=teacher._id;
                                                clas.save();
                                                console.log("Teacher created!!!");
                                                console.log(teacher);
                                                res.redirect("/users/new/student");
                                            }
                                        })

                                    }
                                }
                            })
                        }
                    })
                }else {
                    var newUser = new User({username:req.body.username, type:req.body.type});
                    User.register(newUser,"password",function (err,user) {
                        if(err){
                            console.log(err);
                            return res.redirect("/users/new/teacher");
                        }else {
                            if(req.body.type==="Teacher"){
                                console.log("Hey!!!! from Teacher");
                                var newTeacher = new Teacher({
                                    firstName:req.body.firstName,
                                    secondName:req.body.secondName,
                                    birthday:req.body.date,
                                    address:req.body.address,
                                    class : req.body.class,
                                    grade : req.body.grade,
                                    subject : req.body.subject
                                })
                                Teacher.create(newTeacher,function (err,teacher) {
                                    if(err){
                                        console.log(err);
                                    }else {
                                        teacher.authent.id=user._id;
                                        teacher.username=user.username;
                                        teacher.isClassTeacher = true;
                                        teacher.save();
                                        newClass.classTeacher.id=teacher._id;
                                        newClass.save();
                                        console.log("Teacher created!!!");
                                        console.log(teacher);
                                        res.redirect("/users/new/student");
                                    }
                                })

                            }
                        }
                    })

                }
            }
        })
    }else{
        var newUser = new User({username:req.body.username, type:req.body.type});
        User.register(newUser,"password",function (err,user) {
            if(err){
                console.log(err);
                return res.redirect("/users/new/teacher");
            }else {
                if(req.body.type==="Teacher"){
                    console.log("Hey!!!! from Teacher");
                    var newTeacher = new Teacher({
                        firstName:req.body.firstName,
                        secondName:req.body.secondName,
                        birthday:req.body.date,
                        address:req.body.address,
                        class : req.body.class,
                        grade : req.body.grade,
                        subject : req.body.subject
                    })
                    Student.create(newTeacher,function (err,teacher) {
                        if(err){
                            console.log(err);
                        }else {
                            teacher.authent.id=user._id;
                            teacher.username=user.username;
                            teacher.isClassTeacher = false;
                            teacher.save();
                            console.log("Teacher created!!!");
                            console.log(teacher);
                            res.redirect("/users/new/student");
                        }
                    })

                }
            }
        })

    }


});


router.get("/view/student", isLoggedIn, function (req,res) {
    Student.find({},function (err,students) {
        if(err){
            console.log(err);
        }else {
            res.render("admin/students",{students:students});
        }
    })
});

router.get("/view/teacher", isLoggedIn, function (req,res) {
    Teacher.find({},function (err,teacher) {
        if(err){
            console.log(err);
        }else {
            res.render("admin/teachers",{students:teacher});
        }
    })
});

router.get("/notice",isLoggedIn,function (req,res) {
    res.render("admin/addNotice");
})

router.post("/notice",isLoggedIn,function (req,res) {
    var notice = new AdminNotice({
        topic:req.body.topic,
        notice:req.body.notice
    })
    AdminNotice.remove({},function (err) {
        if(err){
            console.log(err);
        }else {
            AdminNotice.create(notice,function (err,newNotice) {
                if(err){
                    console.log(err);
                }else {
                    console.log(newNotice);
                    res.redirect("/dashbord")
                }
            })
        }
    })

})

router.get("/leaveapplication/new",function (req,res) {

    res.render("admin/newLeaveapplication");
});

router.get("/leaveapplication",function (req,res) {
    Leave.find({'username' : req.user.username}, function(err, leaves){
        res.render("admin/viewLeaveapplication",{
            leaves:leaves
        });
    });


});

router.post("/leaveapplication",function (req,res) {
    req.checkBody('startdate','startdate is required').notEmpty();
    req.checkBody('enddate','enddate is required').notEmpty();
    req.checkBody('reason','reason is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if(errors){
        // res.render("Error", {
        //     errors:errors
        // });
    }
    else{
        let leave = new Leave();
        leave.startdate = req.body.startdate;
        leave.enddate = req.body.enddate;
        leave.reason = req.body.reason;
        leave.username = req.user.username;
        leave.status = false;

        leave.save(function(err){
            if(err){
                console.log(err);
                return;
            } else {
                res.redirect('/users/leaveapplication');
            }
        });
    }
});

router.get("/leave/:id",isLoggedIn,function (req,res) {
    Leave.findById(req.params.id,function (err,leaveApllication) {
        if(err){
            console.log(err);
        }else {
            res.render("admin/detailLeaveapplication",{application:leaveApllication});
        }
    })
})

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()&& (req.user.type=='admin')){
        return next();
    }
    res.redirect("/");
}
module.exports = router;