var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://47.96.80.93:27017/weChatTest');//；连接数据库
// const userModel = require("../model/user")
const userModel = require("../model/user");
const accessToken = require("../model/accessToken");
module.exports = {
    user:userModel(mongoose),
    accessToken:accessToken(mongoose)
}
// module.exports = 