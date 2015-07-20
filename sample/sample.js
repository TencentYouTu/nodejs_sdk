var tencentyoutuyun = require('..');
var conf  = tencentyoutuyun.conf;
var youtu = tencentyoutuyun.youtu;

// 开发者　和应用信息
var appid = ''
var secretId = ''
var secretKey = ''
var userid = ''

conf.setAppInfo(appid, secretId, secretKey, userid)



// 人脸检测
youtu.detectface('a.jpg', function(data){
    console.log("detectface:" + JSON.stringify(data));
});

// 其他函数调用 类似


