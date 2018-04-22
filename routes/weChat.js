var express = require('express');
var router = express.Router();
const crypto = require('crypto')
const XMLJS = require('xml2js');
const parser = new XMLJS.Parser();
const WeChatService = require('../service/weChat.js');
const MongoService = require('../service/mongo.js');

/* GET home page. */
router.all('/', function(req, res, next) {
    
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var echostr   = req.query.echostr;
    var nonce     = req.query.nonce;
    let result  = WeChatService.checkSignature(signature,echostr,nonce,timestamp)
    
    if(result){
        // WeChatService.userEvent(req);
        req.on("data", function(data) {
            //将xml解析
            parser.parseString(data.toString(), function(err, result) {
                var body = result.xml;
                console.log('body',body);
                var messageType = body.MsgType[0];
                //用户点击菜单响应事件
                if(messageType === 'event') {
                    var eventName = body.Event[0];
                    WeChatService.userEvent(body).then(result => res.send(result));
                    
                //自动回复消息
                }else if(messageType === 'text') {
                    // EventFunction.responseNews(body, res);
                //第一次填写URL时确认接口是否有效
                }else {
                    res.send(echostr);
                }
            });
        });
        // res.send(echostr)
    }else{
        res.send("error");
    }
    
});
router.get('/getAccessToken', async function(req, res, next) {
    let accesstoken = await WeChatService.getAccessToken()[0];
    res.send(accesstoken);

});
router.get('/test', function(req, res, next) {
    var user = new MongoService.user({openId:"123"})
    user.save().then((result)=>{
        res.send(result)
    })

});
router.get('/templateMsg',async function(req,res,next){
    var msg = {
        "first": {
            "value":"恭喜你购买成功！",
            "color":"#173177"
        },
        "keyword1":{
            "value":"巧克力",
            "color":"#173177"
        },
        "keyword2": {
            "value":"39.8元",
            "color":"#173177"
        },
        "keyword3": {
            "value":"2014年9月22日",
            "color":"#173177"
        },
        "remark":{
            "value":"欢迎再次购买！",
            "color":"#173177"
        }}
    const openId = req.query.openId;
    const templateId = "71CXn0sSkG30E-lm0fct6AarO6Sj-vQ3_llnEOLD0mM"
    let result = await WeChatService.sendTemplateMsg(openId,templateId,msg)
    res.send(result)

})
module.exports = router;
