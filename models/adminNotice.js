var mongoose = require("mongoose");

var adminNoticeSchema = mongoose.Schema({
    topic    : {
        type:String,
        required:true
    },
    notice    : {
        type:String,
        required:true
    }
});

module.exports = mongoose.model("AdminNotice", adminNoticeSchema);