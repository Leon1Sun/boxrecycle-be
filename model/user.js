var mongoose = require('mongoose');
var Schema = mongoose.Schema;   //  创建模型
var userScheMa = new Schema({
    _id:String,
    openId: String,
    subscribe:Boolean,
    uniqueCode:String
});

module.exports = (mongoose)=>{
    return mongoose.model("userScheMa",userScheMa,"user")
}