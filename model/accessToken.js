var mongoose = require('mongoose');
var Schema = mongoose.Schema;   //  创建模型
var accessTokenSchema = new Schema({
    accesstoken: String,
    timestamp:Number
});

module.exports = (mongoose)=>{
    return mongoose.model("accessTokenSchema",accessTokenSchema,"accessToken")
}