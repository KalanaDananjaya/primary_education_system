var mongoose = require("mongoose");

var teacherNoticeSchema = mongoose.Schema({
    topic    : {
        type:String
    },
    notice    : {
        type:String
    },
    grade: {
        type: String
    }
});

module.exports = mongoose.model("TeacherNotice", teacherNoticeSchema);