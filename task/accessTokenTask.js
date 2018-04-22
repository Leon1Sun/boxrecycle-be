const wechartService = require("../service/weChat")
const MongoService = require('../service/mongo.js');
let accessTokenTask = ()=>{
    wechartService.getAccessTokenFromWeChat();
    setInterval(()=>{
        wechartService.getAccessTokenFromWeChat()
    },3600 * 1.7 * 1000)
}
module.exports = accessTokenTask;