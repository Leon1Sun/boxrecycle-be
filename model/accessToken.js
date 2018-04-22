var mongoose = require('mongoose');
var Schema = mongoose.Schema;   //  创建模型
var accessToken = new Schema({
    accesstoken: String,
    timastamp:Number
});

module.exports = (mongoose)=>{
    return mongoose.model("accessToken",accessToken,"accessToken")
}