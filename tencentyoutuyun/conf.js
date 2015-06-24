var fs = require('fs');
var path = require('path');
var os = require('os');

// 请到app.qcloud.com查看您对应的appid相关信息并填充
exports.APPID = '您的APPID';
exports.SECRET_ID = '您的SECRET_ID';
exports.SECRET_KEY = '您的SECRET_KEY';
exports.USERID = '您的开发者userid';

var pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'package.json')));
var ua = function() {
    return 'QcloudNodejs/' + pkg.version + ' (' + os.type() + '; ' + os.platform() + '; ' + os.arch() + '; ) ';
}

exports.USER_AGENT = ua;
exports.API_YOUTU_SERVER= '101.226.76.164';
exports.API_YOUTU_PORT= 18082;

exports.setAppInfo = function(appid, secretId, secretKey, userid) {
    module.exports.APPID = appid;
    module.exports.SECRET_ID = secretId;
    module.exports.SECRET_KEY = secretKey;
    module.exports.USERID = userid;
}


