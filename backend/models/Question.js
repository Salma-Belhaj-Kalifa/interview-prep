const mongoose = require("mongoose");
QuestionSchema = new mongoose.Schema(
    {
        session: {type: mongoose.Schema.Types.ObjectId, ref:"Session"},
        question:String,
        answer:String,
        note:String,
        isPinned:{type:Boolean, default: false}
    },
    {timestamps:true}
);
module.exports = mongoose.model("Question", QuestionSchema);