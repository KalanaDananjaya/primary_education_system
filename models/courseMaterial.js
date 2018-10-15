var mongoose = require("mongoose");

var courseMaterialScehma = mongoose.Schema({
    date    : {
        type:Date,
        required:true
    },
    subject : {
        type: String,
        required :true
    },
    fileName    : {
        type:String,
        required:true
    }
});

module.exports = mongoose.model("CourseMaterials", courseMaterialScehma);