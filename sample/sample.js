var tencentyoutuyun = require('..');
var conf  = tencentyoutuyun.conf;
var youtu = tencentyoutuyun.youtu;

// 设置开发者和应用信息, 请填写你在开放平台
var appid = '';
var secretId = '';
var secretKey = '';
var userid = '';

conf.setAppInfo(appid, secretId, secretKey, userid, 1)

// 人脸检测 测试
youtu.detectface('a.jpg', function(data){
    console.log("detectface:" + JSON.stringify(data));
});

// 人脸比对 测试
//youtu.facecompare('a.jpg', 'a.jpg', function(data){
//    console.log("facecompare:" + JSON.stringify(data));
//});

// 人脸比对 测试
//youtu.fuzzydetect('a.jpg', function(data){
//    console.log("fuzzydetect:" + JSON.stringify(data));
//});

//youtu.fooddetect('a.jpg', function(data){
//    console.log("fooddetect:" + JSON.stringify(data));
//});

youtu.imagetag('a.jpg', function(data){
    console.log("imagetag:" + JSON.stringify(data));
});

// 其他接口 类似
