var mongoose = require("mongoose");

var announcement = mongoose.Schema({
    notice    : {
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Announcement", announcement);