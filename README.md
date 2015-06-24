# tencentyun-image-node
nodejs sdk for [腾讯云智能优图服务](http://www.qcloud.com/product/youtu.html)

## 安装
npm install tencentyoutuyun

## 动态指定您的配置
```javascript
tencentyun.conf.setAppInfo('200674', 'AKID6iy7TYQpLA4AmoGtNVlfZij00wy6qEuI', 'LtkKOTyAV0g4i4UscFXDYEGUIlxZrtnL', '123456');
```

## 人脸检测demo
```javascript
var tencentyoutuyun = require('..');
var conf  = tencentyoutuyun.conf;
var youtu = tencentyoutuyun.youtu;

// 开发者　和应用信息
conf.setAppInfo('xxxx', 'xxx', 'xxxx', 'xxx');


// 人脸检测
youtu.detectface('a.jpg', function(data){
    console.log("detectface:" + JSON.stringify(data));
});
```
