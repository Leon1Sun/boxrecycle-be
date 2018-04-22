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
    getAccessToken:async function (params){
        return superagent
        .get("https://api.weixin.qq.com/cgi-bin/token")
        .query(`grant_type=client_credential&appid=${Config.appId}&secret=${Config.appSecret}`)
        .then((res)=>{
            console.log("getAccessToken",res.text)
            
            let result = JSON.parse(res.text)
            console.log("result",result)
            console.log("result.access_token",result.access_token)
            return result.access_token;
        })
    },
    userEvent:async (body)=>{
        console.log("=======User Event=========");
        if(body.Event[0] === 'subscribe'){
            const openId = body.FromUserName[0];
            var user = new MongoService.user({_id:openId,openId:openId,subscribe:true});
            user.save().then((result)=>{
                return result
            })
        }
        else if(body.Event[0] === 'unsubscribe'){

        }
    }
}