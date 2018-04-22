const crypto = require('crypto')
const superagent = require('superagent');
const Config = require('../config/config');
const MongoService = require('../service/mongo.js');

module.exports = {
    checkSignature:(signature,echostr,nonce,timestamp)=>{
        var token=Config.token;
        // var signature = req.query.signature;
        // var timestamp = req.query.timestamp;
        // var echostr   = req.query.echostr;
        // var nonce     = req.query.nonce;
        let oriArray = [];
        oriArray[0] = nonce;
        oriArray[1] = timestamp;
        oriArray[2] = token;
        oriArray.sort();
        let original = oriArray.join('');
        var sha1=require('crypto').createHash('sha1');
    
        sha1.update(original);
        var scyptoString=sha1.digest('hex')
        return signature === scyptoString
    },
    getAccessTokenFromWeChat:  (params)=>{
        return  superagent
        .get("https://api.weixin.qq.com/cgi-bin/token")
        .query(`grant_type=client_credential&appid=${Config.appId}&secret=${Config.appSecret}`)
        .then((res)=>{
            let result = JSON.parse(res.text)            
            console.log("========getAccessToken ============",result.access_token)
            let now = (new Date()).getTime()
            var token = new MongoService.accessToken({accesstoken:result.access_token,timestamp:now})
            return  token.save();
        })
    },
    getAccessToken: async ()=>{
        return await MongoService.accessToken.find().sort({"timestamp":-1}).limit(1);
    },
    userEvent:async (body)=>{
        console.log("=======User Event=========");
        if(body.Event[0] === 'subscribe'){
            const openId = body.FromUserName[0];
            var user = new MongoService.user({_id:openId,openId:openId,subscribe:true});
            return await user.save()
        }
        else if(body.Event[0] === 'unsubscribe'){
        }
        return await 1;
    },
    sendTemplateMsg:async (openId,templateId,msg)=>{
        let token = await MongoService.accessToken.find().sort({"timestamp":-1}).limit(1);
        console.log("openId",openId)
        token = token[0].accesstoken;
        console.log("token",token)
        return await superagent.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`,{
            "touser":openId,
            "template_id":templateId,
            "url":"http://weixin.qq.com/download",      
            "data":msg
        })
    }
}