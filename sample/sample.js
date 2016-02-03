var tencentyoutuyun = require('..');
var conf  = tencentyoutuyun.conf;
var youtu = tencentyoutuyun.youtu;

// 设置开发者和应用信息, 请填写你在开放平台
var appid = 'xxx';
var secretId = 'xxxx';
var secretKey = 'xxx';
var userid = 'xxx';

conf.setAppInfo(appid, secretId, secretKey, userid, 0)

// 人脸检测 测试
//youtu.detectface('a.jpg', 0, function(data){
//    console.log("detectface:" + JSON.stringify(data));
//});

// 人脸比对 测试
youtu.facecompare_file_url('a.jpg', 'http://c.hiphotos.baidu.com/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=43d7b2776a81800a7ae8815cd05c589f/8601a18b87d6277f0ca079c02e381f30e824fc9c.jpg', function(data){
    console.log("facecompare:" + JSON.stringify(data));
});

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
