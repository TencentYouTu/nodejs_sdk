# tencentyun-youtu-nodejs-sdk

nodejs sdk for [腾讯优图开放平台](http://open.youtu.qq.com/)

## 安装

```sh
git clone https://github.com/TencentYouTu/nodejs_sdk.git
```

## 名词

- `AppId` 平台添加应用后分配的AppId
- `SecretId` 平台添加应用后分配的SecretId
- `SecretKey` 平台添加应用后分配的SecretKey
- `签名` 接口鉴权凭证，由`AppId`、`SecretId`、`SecretKey`等生成，详见<http://open.youtu.qq.com/welcome/authentication>

## API

### `conf`

配置项相关

#### `conf.setAppInfo(appid, secretId, secretKey, userid, domain)`

初始化配置项

- 参数
	- `appid` AppId 字符串类型
	- `secretId` SecretId 字符串类型
	- `secretKey` SecretKey 字符串类型
	- `userid` 业务中的用户标识 字符串类型
	- `domain` 主机标识，0（优图服务），1（腾讯云）
- 返回值 无（`undefined`）

#### 其它

- `conf.USER_AGENT` 请求的UserAgent
- `conf.API_YOUTU_SERVER` 请求的优图服务器地址 默认为 api.youtu.qq.com
- `conf.API_YOUTU_PORT` 请求的优图服务器端口 默认为 80

### `auth`

接口调用时 计算签名鉴权相关逻辑。

#### `auth.appSign(expired, userid)`

获取签名，依赖`conf`中的配置项。

- 参数
    - `expired` 过期时间，UNIX时间戳, 计算的签名在过期时间之前有效.
    - `userid` 业务中的用户标识
- 返回值 签名（base64）

#### 其它

- `auth.AUTH_PARAMS_ERROR` 参数错误常量（-1）
- `auth.AUTH_SECRET_ID_KEY_ERROR` 密钥ID或者密钥KEY错误常量（-2）

### `youtu`

优图相关API封装，均为异步函数，使用回调函数方式获取结果。

> 注意：此处callback函数并未遵从Node.js风格的错误回调`callback(error, data)`，因此需要对返回数据中的状态进行判断，只有200时认为是请求成功。

#### `youtu.detectface(imagePath, isbigface, callback)`

人脸检测，检测给定图片(Image)中的所有人脸(Face)的位置和相应的面部属性。位置包括(x, y, w, h)，面部属性包括性别(gender)、年龄(age)
表情(expression)、眼镜(glass)和姿态(pitch，roll，yaw)。

- 参数
	- `imagePath` 图片路径
	- `isbigface` 是否大脸模式 ０表示检测所有人脸， 1表示只检测照片最大人脸　适合单人照模式
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档


#### `youtu.faceshape(imagePath, isbigface, callback)`

人脸定位，检测给定图片中人脸的五官。对请求图片进行人脸配准，计算构成人脸轮廓的88个点，
包括眉毛（左右各8点）、眼睛（左右各8点）、鼻子（13点）、嘴巴（22点）、脸型轮廓（21点）

- 参数
	- `imagePath` 图片路径
	- `isbigface` 是否大脸模式 ０表示检测所有人脸， 1表示只检测照片最大人脸　适合单人照模式
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

#### `youtu.facecompare_file_url(image_file, image_url, callback)`

人脸对比，计算两个Face的相似性以及五官相似度。

- 参数
	- `image_file` 第一张图片路径
	- `image_url` 第二张图片url
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
	- `group_id` 需要识别的人 所在的组
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档

#### `youtu.newperson(image_a, person_id, person_name, group_ids, persontag, callback)`

个体创建，创建一个Person，并将Person放置到group_ids指定的组当中。

- 参数
	- `image_a` 图片路径
	- `person_id` 个体Person
	- `person_name` 个体Person的名字
	- `group_ids` 要加入的组的列表（数组）
	- `persontag` 备注信息，用户自解释字段
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档

#### `youtu.delperson(person_id, callback)`

删除一个Person

- 参数
	- `person_id` 个体Person
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档


#### `youtu.addface(person_id, images, facetag, callback)`

添加人脸，在创建一个Person后， 增加person下面的人脸, 可以用于后面的比对。

- 参数
	- `person_id` 个体Person
	- `images` 图片路径(数组)
	- `facetag` 人脸自定义标签
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档



#### `youtu.delface(person_id, face_ids, callback)`

删除人脸，删除一个person下的face，包括特征，属性和face_id。

- 参数
	- `person_id` 个体Person
	- `face_ids` 要删除的faceId列表（数组）
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档

#### `youtu.setinfo(person_name, person_id, tag,  callback)`

设置Person的信息

- 参数
	- `person_name` 个体Person的name
	- `person_id` 个体Person
	- `tag` 个体Person的tag, 用户自解释字段
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档

#### `youtu.getinfo(person_id, callback)`

获取一个Person的信息，包括name、id、tag、相关的face以及groups等信息。

- 参数
	- `person_id` 个体Person
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档

#### `youtu.getgroupids(callback)`

获取一个AppId下所有group列表

- 参数
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档

#### `youtu.getpersonIds(group_id, callback)`

获取一个组Group中所有person列表

- 参数
	- `group_id` 组
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档


#### `youtu.getfaceIds(person_id, callback)`

获取一个组person中所有face列表

- 参数
	- `person_id` Person
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档

### `youtu.getfaceinfo(face_id, callback)`

获取一个face的相关特征信息

- 参数
	- `face_id` Face
	- `callback(data)` 回调函数

其中回调函数`callback`的参数`data`是一个对象，结构如下：

- `httpcode` HTTP状态码
- `code` 状态码，目前和`httpcode`相同
- `message` 状态码对应的描述文字
- `data` 数据对象，参考API文档



## 致谢
20150717 感谢[TooBug](https://github.com/TooBug) 提出的接口说明文档 和 bug 修复
