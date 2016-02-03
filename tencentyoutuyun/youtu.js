var http = require('http');
var https = require('https');
var fs = require('fs');



var auth = require('./auth');
var conf = require('./conf');

// 30 days
var EXPIRED_SECONDS = 2592000;

/**
 * return the status message 
 */
function statusText(status) {

    var statusText = 'unkown';
    
    switch (status) {
    case 200:
      statusText = 'HTTP OK';
      break;
    case 400:
      statusText = 'Bad Request';
      break;
    case 401:
      statusText = 'Unauthorized';
      break;
    case 403:
      statusText = 'Forbidden';
      break;
    case 500:
      statusText = 'Internal Server Error';
      break;
    }
    return statusText;
};

function  getrequest(protocol, params, callback) {

    return protocol.request(params, function(response) {
    
        // console.log('STATUS: ' + response.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(response.headers));

        if( response.statusCode  !=  200 ){
            callback({'httpcode':response.statusCode, 'code':response.statusCode , 'message':statusText(response.statusCode) , 'data':{}});
            return;
        }

        var body = '';
        response.setEncoding('utf8');
        
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function(){
            callback({'httpcode':response.statusCode, 'code':response.statusCode , 'message':statusText(response.statusCode) , 'data':JSON.parse(body)});
        });

        response.on('error', function(e){
            callback({'httpcode':response.statusCode, 'code':response.statusCode , 'message': '' + e , 'data':{} });
        });
    }); // 
};

/**
 * @brief detectface
 * @param imagePath 待检测的路径（本地路径或url）
 * @param isbigface 是否大脸模式 ０表示检测所有人脸， 1表示只检测照片最大人脸　适合单人照模式
 * @param callback 回调函数, 参见Readme 文档
 */
exports.detectface = function(imagePath,　isbigface, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    var tag = imagePath.substring(0,4);
    var request_body = '';
    if (tag == 'http')
    {
        request_body = JSON.stringify({
            app_id: conf.APPID,
            url : imagePath,
            mode  : isbigface,
        });
    }
    else
    {
        var data = fs.readFileSync(imagePath).toString('base64');
        
        if(data == null) {
            callback({'httpcode':0, 'code':-1, 'message':'file ' + imagePath + ' not exists or params error', 'data':{}});
            return;
        };

        request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data.toString('base64'),
            mode  : isbigface,
        });
    }
    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/detectface',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };
    
    //console.log(request_body);
    //console.log(params);
    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    }
    
    request.on('error', function(e) {
        callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });
    
    // send the request body
    request.end(request_body);    
    //console.log(request_body);
}


/**
 * @brief faceshape
 * @param imagePath 待检测的路径（本地路径或url）
 * @param isbigface 是否大脸模式
 * @param callback 回调函数, 参见Readme 文档
 */
exports.faceshape = function(imagePath, isbigface, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    var tag = imagePath.substring(0,4);
    var request_body = '';
    if (tag == 'http')
    {
        request_body = JSON.stringify({
            app_id: conf.APPID,
            url : imagePath,
            mode  : isbigface,
        });
    }
    else
    {
        var data = fs.readFileSync(imagePath).toString('base64');
        
        if(data == null) {
            callback({'httpcode':0, 'code':-1, 'message':'file ' + imagePath + ' not exists or params error', 'data':{}});
            return;
        };

        request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data.toString('base64'),
            mode  : isbigface,
        });
    }
    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/faceshape',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }                
    };
        
    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    }
    
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}


/**
 * @brief facecompare
 * @param image_a 待比对的A图片路径（本地路径或url）
 * @param image_b 待比对的B图片路径（本地路径或url）
 * @param callback 回调函数, 参见Readme 文档
 */
exports.facecompare = function(image_a, image_b, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    var tag = image_a.substring(0,4);
    var request_body = '';
    if (tag == 'http')
    {
        var request_body = JSON.stringify({
            app_id: conf.APPID,
            urlA : image_a,
            urlB : image_b,
        });
    }
    else
    {
        var data_a = fs.readFileSync(image_a).toString('base64');
        var data_b = fs.readFileSync(image_b).toString('base64');
        
        if(data_a == null || data_b == null ) {
            callback({'httpcode':0, 'code':-1, 'message':'file ' + imagePath + ' not exists or params error', 'data':{}});
            return;
        };

        var request_body = JSON.stringify({
            app_id: conf.APPID,
            imageA : data_a.toString('base64'),
            imageB : data_b.toString('base64'),
        });
    }
    
    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/facecompare',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }                
    };
     
    //console.log(request_body);
    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
       
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}


/**
 * @brief facecompare
 * @param image_file 待比对的A图片路径（本地路径)
 * @param image_url 待比对的B图片路径（url）
 * @param callback 回调函数, 参见Readme 文档
 */
exports.facecompare_file_url = function(image_file, image_url, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);

    var data_a = fs.readFileSync(image_file).toString('base64');
    
    if(data_a == null ) {
        callback({'httpcode':0, 'code':-1, 'message':'file ' + imagePath + ' not exists or params error', 'data':{}});
        return;
    };

    var request_body = JSON.stringify({
        app_id: conf.APPID,
        imageA : data_a.toString('base64'),
        urlB   : image_url,
    });

    
    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/facecompare',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }                
    };
     
    //console.log(request_body);
    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
       
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}


/**
 * @brief faceverify
 * @param person_id 待验证的人脸id
 * @param imagePath 待验证的图片路径（本地路径或url）
 * @param callback 回调函数, 参见Readme 文档
 */
exports.faceverify = function(imagePath, person_id, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    var tag = imagePath.substring(0,4);
    var request_body = '';
    
    if (tag == 'http')
    {
        request_body = JSON.stringify({
            app_id: conf.APPID,
            url : imagePath,
            person_id : person_id,
        });
    }
    else
    {
        var data = fs.readFileSync(imagePath).toString('base64');
        
        if(data == null) {
            callback({'httpcode':0, 'code':-1, 'message':'file ' + imagePath + ' not exists or params error', 'data':{}});
            return;
        };

        request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data.toString('base64'),
            person_id : person_id,
        });
    }
    
    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/faceverify',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }                
    };
        
    //console.log(request_body);
    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
       

    request.on('error', function(e) {
             callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
        });

    // send the request body
    request.end(request_body);
        
}


/**
 * @brief faceidentify
 * @param group_id 识别的组id
 * @param imagePath 待识别的图片路径（本地路径或url）
 * @param callback 回调函数, 参见Readme 文档
 */
exports.faceidentify= function(imagePath, group_id, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    var tag = imagePath.substring(0,4);
    var request_body = '';
    
    if (tag == 'http')
    {
        request_body = JSON.stringify({
            app_id: conf.APPID,
            url : imagePath,
            group_id : group_id,
        });
    }
    else
    {
        var data = fs.readFileSync(imagePath).toString('base64');
        
        if(data == null) {
            callback({'httpcode':0, 'code':-1, 'message':'file ' + imagePath + ' not exists or params error', 'data':{}});
            return;
        };

        request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data.toString('base64'),
            group_id : group_id,
        });
    }
    
    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/faceidentify',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }                
    };
        
    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
       
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}

/**
 * @brief newperson
 * @param imagePath 图片路径（本地路径或url）
 * @param person_id 新建的个体id，用户指定，需要保证app_id下的唯一性
 * @param person_name 个体的名字
 * @param group_ids 新建的个体存放的组id，可以指定多个组id，用户指定（组默认创建）
 * @param persontag 人备注信息，用户自解释字段
 * @param callback 回调函数, 参见Readme 文档
 */
exports.newperson= function(imagePath, person_id, person_name, group_ids, persontag, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
    var tag = imagePath.substring(0,4);
    var request_body = '';

    if (tag == 'http')
    {
        request_body = JSON.stringify({
            app_id: conf.APPID,
            url : imagePath,
            person_id : person_id,
            person_name: person_name,
            group_ids : group_ids,
            tag: persontag,
        });
    }
    else
    {
        var data = fs.readFileSync(imagePath).toString('base64');
        
        if(data == null) {
            callback({'httpcode':0, 'code':-1, 'message':'file ' + imagePath + ' not exists or params error', 'data':{}});
            return;
        };

        request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data.toString('base64'),
            person_id : person_id,
            person_name: person_name,
            group_ids : group_ids,
            tag: persontag,
        });
    }
    

    var buffer = new Buffer(request_body, "UTF-8");

    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/newperson',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': buffer.length,
            'Content-Type': 'text/json'
        }                
    };

    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
    
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });
    
    // send the request body
    request.end(request_body);
}


/**
 * @brief delperson
 * @param person_id 待删除的个体id
 * @param callback 回调函数, 参见Readme 文档
 */
exports.delperson= function(person_id, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
    var request_body = JSON.stringify({
        app_id: conf.APPID,
        person_id : person_id,
    });

    var params = {
        hostname: conf.API_YOUTU_SERVER,
        port: conf.API_YOUTU_PORT,
        path: '/youtu/api/delperson',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };

    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
 
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}



/**
 * @brief addface
 * @param person_id 新增人脸的个体身份id
 * @param images 待增加的包含人脸的图片lu路径数组，可加入多张（包体大小<2m）
 * @param facetag 人脸备注信息，用户自解释字段
 * @param callback 回调函数, 参见Readme 文档
 */
 exports.addface = function(person_id, images, facetag, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
    var tag = images[0].substring(0,4);
    var request_body = '';
    
    if (tag == 'http')
    {
        request_body = JSON.stringify({
            app_id: conf.APPID,
            urls : images,
            person_id : person_id,
            tag : facetag
        });
    }
    else
    {
        var image_bufs = new Array();
    
        for( var idx in images)
        {
            var data =fs.readFileSync(images[idx]);
            if(!data) {
                callback({'httpcode':0, 'code':-1, 'message': images[idx] + ": read failed!", 'data':{}});
                return;    
            }

           image_bufs[idx] = data.toString('base64');
        }  
    
        request_body = JSON.stringify({
            app_id: conf.APPID,
            images : image_bufs,
            person_id : person_id,
            tag : facetag
        });
    }
    
    //console.log(request_body);
    var buffer = new Buffer(request_body, "UTF-8");
    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/addface',
        method: 'POST',
        headers: {
        'Authorization': sign,
        'User-Agent'   : conf.USER_AGENT(),
        'Content-Length': buffer.length,
        'Content-Type': 'text/json'
        }                
    };

    //console.log(params);
    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
 
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);

}

 
/**
 * @brief delface
 * @param person_id 待删除人脸的个体身份id
 * @param face_ids 待删除的人脸id 数组
 * @param callback 回调函数, 参见Readme 文档
 */
exports.delface = function(person_id, face_ids, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
    var request_body = JSON.stringify({
        app_id: conf.APPID,
        face_ids: face_ids,
        person_id : person_id,
    });

    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/delface',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };

    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    }
     
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}


/**
 * @brief setinfo
 * @param person_id 待设置的个体身份id
 * @param person_name 新设置的个体名字
 * @param tag 新设置的人脸备注信息
 * @param callback 回调函数, 参见Readme 文档
 */
exports.setinfo = function(person_name, person_id, tag, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
    var request_body = JSON.stringify({
        app_id: conf.APPID,
        person_name: person_name,
        person_id : person_id,
        tag: tag,
    });

    var buffer = new Buffer(request_body, "UTF-8");
    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/setinfo',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': buffer.length,
            'Content-Type': 'text/json'
        }
    };

    var request = null;
    if (conf.API_DOMAIN == 0)
    {
       request = getrequest(http, params, callback);
    } 
    else {
       request = getrequest(https, params, callback);
    } 
 
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}




/**
 * @brief getinfo
 * @param person_id 待查询的个体身份id
 * @param callback 回调函数, 参见Readme 文档
 */
exports.getinfo = function(person_id, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
    
    var request_body = JSON.stringify({
        app_id: conf.APPID,
        person_id : person_id,
    });

    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/getinfo',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };

    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
 
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}


/**
 * @brief getgroupids
 * @param callback 回调函数, 参见Readme 文档
 */
exports.getgroupids = function(callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
    var request_body = JSON.stringify({
        app_id: conf.APPID,
    });

    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/getgroupids',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };


    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    }
     
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}


/**
 * @brief getpersonids
 * @param group_id 待查询的组id
 * @param callback 回调函数, 参见Readme 文档
 */
exports.getpersonids = function(group_id, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
    
    var request_body = JSON.stringify({
        app_id: conf.APPID,
        group_id:group_id
    });

    var params = {
        hostname: conf.API_YOUTU_SERVER,
        port: conf.API_YOUTU_PORT,
        path: '/youtu/api/getpersonids',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };

    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 

    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}




/**
 * @brief getfaceids
 * @param person_id 待查询的个体id
 * @param callback 回调函数, 参见Readme 文档
 */
exports.getfaceids = function(person_id, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
    
    var request_body = JSON.stringify({
        app_id: conf.APPID,
        person_id:person_id
    });

    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/getfaceids',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };

    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    }  
 
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}



/**
 * @brief getfaceinfo
 * @param face_id 待查询的人脸id
 * @param callback 回调函数, 参见Readme 文档
 */
exports.getfaceinfo = function(face_id, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
    var request_body = JSON.stringify({
        app_id: conf.APPID,
        face_id:face_id
    });

    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/api/getfaceinfo',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };

    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
 
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}

/**
 * @brief fuzzydetect
 * @param imagePath 待检测的路径
 * @param callback 回调函数, 参见Readme 文档
 */
exports.fuzzydetect = function(imagePath,　callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    var tag = imagePath.substring(0,4);
    var request_body = '';
    if (tag == 'http')
    {
        request_body = JSON.stringify({
            app_id: conf.APPID,
            url : imagePath,
        });
    }
    else
    {
        var data = fs.readFileSync(imagePath).toString('base64');
        
        if(data == null) {
            callback({'httpcode':0, 'code':-1, 'message':'file ' + imagePath + ' not exists or params error', 'data':{}});
            return;
        };

        request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data.toString('base64'),
        });
    }
    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/imageapi/fuzzydetect',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };
    //console.log(request_body);
    //console.log(params);
    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
        
    request.on('error', function(e) {
        callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });
    
    // send the request body
    request.end(request_body);    
}

/**
 * @brief fooddetect
 * @param imagePath 待检测的路径
 * @param callback 回调函数, 参见Readme 文档
 */
exports.fooddetect = function(imagePath,　callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    var tag = imagePath.substring(0,4);
    var request_body = '';
    if (tag == 'http')
    {
        request_body = JSON.stringify({
            app_id: conf.APPID,
            url : imagePath,
        });
    }
    else
    {
        var data = fs.readFileSync(imagePath).toString('base64');
        
        if(data == null) {
            callback({'httpcode':0, 'code':-1, 'message':'file ' + imagePath + ' not exists or params error', 'data':{}});
            return;
        };

        request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data.toString('base64'),
        });
    }
    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/imageapi/fooddetect',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };
    //console.log(request_body);
    //console.log(params);
    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
        
    request.on('error', function(e) {
        callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });
    
    // send the request body
    request.end(request_body);    
}

/**
 * @brief imagetag
 * @param imagePath 待检测的路径
 * @param callback 回调函数, 参见Readme 文档
 */
exports.imagetag = function(imagePath,　callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    var tag = imagePath.substring(0,4);
    var request_body = '';
    if (tag == 'http')
    {
        request_body = JSON.stringify({
            app_id: conf.APPID,
            url : imagePath,
        });
    }
    else
    {
        var data = fs.readFileSync(imagePath).toString('base64');
        
        if(data == null) {
            callback({'httpcode':0, 'code':-1, 'message':'file ' + imagePath + ' not exists or params error', 'data':{}});
            return;
        };

        request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data.toString('base64'),
        });
    }
    var params = {
        hostname: conf.API_YOUTU_SERVER,
        path: '/youtu/imageapi/imagetag',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };
    //console.log(request_body);
    //console.log(params);
    
    var request = null;
    if (conf.API_DOMAIN == 0)
    {
        request = getrequest(http, params, callback);
    } 
    else {
        request = getrequest(https, params, callback);
    } 
        
    request.on('error', function(e) {
        callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });
    
    // send the request body
    request.end(request_body);    
}
