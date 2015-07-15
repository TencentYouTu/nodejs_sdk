# tencentyun-image-node

nodejs sdk for [腾讯云智能优图服务](http://www.qcloud.com/product/youtu.html)

## 安装

```sh
npm install tencentyoutuyun
```

## 名词

- `AppId` 平台添加应用后分配的AppId
- `SecretId` 平台添加应用后分配的SecretId
- `SecretKey` 平台添加应用后分配的SecretKey
- `签名` 接口鉴权凭证，由`AppId`、`SecretId`、`SecretKey`等生成，详见<http://open.youtu.qq.com/welcome/authentication>

## API

### `conf`

配置项相关

#### `conf.setAppInfo(appid, secretId, secretKey, userid)`

初始化配置项

- 参数
	- `appid` AppId
	- `secretId` SecretId
	- `secretKey` SecretKey
	- `userid` 业务中的用户标识
- 返回值 无（`undefined`）

#### 其它

- `conf.USER_AGENT` 请求的UserAgent
- `conf.API_YOUTU_SERVER` 请求的优图服务器IP
- `conf.API_YOUTU_PORT` 请求的优图服务器端口

### `auth`

接口调用时签名鉴权相关逻辑。

#### `auth.appSign(expired, userid)`

获取签名，依赖`conf`中的配置项。

- 参数
    - `expired` 过期时间，UNIX时间戳
    - `userid` 业务中的用户标识
- 返回值 签名（base64）

#### `exports.AUTH_PARAMS_ERROR`

参数错误常量（-1）

#### `exports.AUTH_SECRET_ID_KEY_ERROR`

密钥ID或者密钥KEY错误常量（-2）

### `youtu`

优图相关API封装，均为异步函数，使用回调函数方式获取结果。

> 注意：此处callback函数并未遵从Node.js风格的错误回调`callback(error, data)`，因此需要对返回数据中的状态进行判断，只有200或者304时认为是请求成功。

#### `youtu.detectface(imagePath, callback)`

人脸检测，检测给定图片(Image)中的所有人脸(Face)的位置和相应的面部属性。位置包括(x, y, w, h)，面部属性包括性别(gender)、年龄(age)
表情(expression)、眼镜(glass)和姿态(pitch，roll，yaw)。

- 参数
	- `imagePath` 图片路径
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档

#### `youtu.facecompare(image_a, image_b, callback)`

人脸对比，计算两个Face的相似性以及五官相似度。

- 参数
	- `image_a` 第一张图片路径
	- `image_b` 第二张图片路径
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档

#### `youtu.faceverify(image_a, person_id, callback)`

人脸验证，给定一个Face和一个Person，返回是否是同一个人的判断以及置信度。

- 参数
	- `image_a` 图片路径
	- `person_id` 待验证的Person
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档

#### `youtu.faceidentify(image_a, group_id, callback)`

人脸识别，对于一个待识别的人脸图片，在一个Group中识别出最相似的Top5 Person作为其身份返回，返回的Top5中按照相似度从大到小排列。

- 参数
	- `image_a` 图片路径
	- `person_id` 待验证的Person
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档


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
