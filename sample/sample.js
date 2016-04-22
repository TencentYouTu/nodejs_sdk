var tencentyoutuyun = require('..');
var conf  = tencentyoutuyun.conf;
var youtu = tencentyoutuyun.youtu;

// 设置开发者和应用信息, 请填写你在开放平台
var appid = '1006920';
var secretId = 'AKIDZ6O9LK4HfRgY1EAcJincpUu27iQdn99A';
var secretKey = 'EU1TBKJfb0zRLFrpT7FuD0JMXBGIy2Yz';
var userid = '1001';

conf.setAppInfo(appid, secretId, secretKey, userid, 0)


//youtu.imageporn('a1.jpg', function(data){
//    console.log("imagetag:" + JSON.stringify(data));
//});

//youtu.idcardocr('a.jpg', 0, function(data){
//    console.log("idcardocr:" + JSON.stringify(data));
//});

//youtu.namecardocr('a.jpg', false, function(data){
//    console.log("namecardocr:" + JSON.stringify(data));
//});

// 其他接口 类似
