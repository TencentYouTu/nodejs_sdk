var tencentyoutuyun = require('..');
var conf  = tencentyoutuyun.conf;
var youtu = tencentyoutuyun.youtu;

// 开发者　和应用信息
conf.setAppInfo('xxxx', 'xxx', 'xxxx', 'xxx');


// 人脸检测
youtu.detectface('a.jpg', function(data){
    console.log("detectface:" + JSON.stringify(data));
});


