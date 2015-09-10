var crypto = require('crypto');
var urlM = require('url');
var conf = require('./conf');

exports.AUTH_PARAMS_ERROR = -1;
exports.AUTH_SECRET_ID_KEY_ERROR = -2;

exports.appSign = function(expired, userid) {

    var secretId  = conf.SECRET_ID || '';
    var secretKey = conf.SECRET_KEY || '';
    var appid     = conf.APPID || '';
    
    var pexpired  = expired || '';
    var puserid   = userid || conf.USERID;
    
    
    if (!pexpired || !puserid ) {
        return module.exports.AUTH_PARAMS_ERROR;
    }
    
    if ( !secretId || !secretKey ) {
        return module.exports.AUTH_SECRET_ID_KEY_ERROR;
    }
    
    var now            = parseInt(Date.now() / 1000);
    var rdm            = parseInt(Math.random() * Math.pow(2, 32));
    
    // the order of every key is not matter verify
    var plainText = 'a=' + appid + '&k=' + secretId + '&e=' + pexpired + '&t=' + now + '&r=' + rdm + '&u=' + puserid;
        
    var data = new Buffer(plainText,'utf8');
    
    var res = crypto.createHmac('sha1',secretKey).update(data).digest();
    
    var bin = Buffer.concat([res,data]);
    
    var sign = bin.toString('base64');

    return sign;
}

