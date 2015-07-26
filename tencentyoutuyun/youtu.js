var http = require('http');
var fs = require('fs');
var querystring = require('querystring');


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


/**
 *  人脸检测
 */
exports.detectface = function(imagePath, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    

    fs.readFile(imagePath, function (err, data){

        if(err) {
            callback({'httpcode':0, 'code':-1, 'message':'file ' + imagePath + ' not exists or params error', 'data':{}});
            return;
        };

        var request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data.toString('base64'),
        });

        var params = {
            hostname: conf.API_YOUTU_SERVER,
            port: conf.API_YOUTU_PORT,
            path: '/youtu/api/detectface',
            method: 'POST',
            headers: {
                'Authorization': sign,
                'User-Agent'   : conf.USER_AGENT(),
                'Content-Length': request_body.length,
                'Content-Type': 'text/json'
            }                
        };
        

        var request = http.request(params, function(response) {
        
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
       
         
        request.on('error', function(e) {
             callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
        });

        // send the request body
        request.end(request_body);
        
    }); //  fs.readFile(
}


/**
 *  人脸比对
 */
exports.facecompare = function(image_a, image_b, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    

    fs.readFile(image_a, function (err_a, data_a){
    fs.readFile(image_b, function (err_b, data_b){

         // 文件　读取　异常
        if(err_a || err_b) {
            callback({'httpcode':0, 'code':-1, 'message': image_a + ":" + err_a.message +"," + image_b +":"+ err_b.message, 'data':{}});
            return;
        };

        var request_body = JSON.stringify({
            app_id: conf.APPID,
            imageA : data_a.toString('base64'),
            imageB : data_b.toString('base64'),
        });

        var params = {
            hostname: conf.API_YOUTU_SERVER,
            port: conf.API_YOUTU_PORT,
            path: '/youtu/api/facecompare',
            method: 'POST',
            headers: {
                'Authorization': sign,
                'User-Agent'   : conf.USER_AGENT(),
                'Content-Length': request_body.length,
                'Content-Type': 'text/json'
            }                
        };
        
        console.log(request_body);

        var request = http.request(params, function(response) {
        
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
       
         
        request.on('error', function(e) {
             callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
        });

        // send the request body
        request.end(request_body);
        
    }); }); //  fs.readFile(
}




/**
 *  人脸验证
 */
exports.faceverify = function(image_a, person_id, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    

    fs.readFile(image_a, function (err_a, data_a){

         // 文件　读取　异常
        if(err_a ) {
            callback({'httpcode':0, 'code':-1, 'message': image_a + ":" + err_a.message, 'data':{}});
            return;
        };

        var request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data_a.toString('base64'),
            person_id : person_id,
        });

        var params = {
            hostname: conf.API_YOUTU_SERVER,
            port: conf.API_YOUTU_PORT,
            path: '/youtu/api/faceverify',
            method: 'POST',
            headers: {
                'Authorization': sign,
                'User-Agent'   : conf.USER_AGENT(),
                'Content-Length': request_body.length,
                'Content-Type': 'text/json'
            }                
        };
        

        var request = http.request(params, function(response) {
        
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
       
         
        request.on('error', function(e) {
             callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
        });

        // send the request body
        request.end(request_body);
        
    });
}


/**
 *  FaceIdentify
 */
exports.faceidentify= function(image_a, group_id, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    

    fs.readFile(image_a, function (err_a, data_a){

         // 文件　读取　异常
        if(err_a) {
            callback({'httpcode':0, 'code':-1, 'message': image_a + ":" + err_a.message, 'data':{}});
            return;
        };

        var request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data_a.toString('base64'),
            group_id : group_id,
        });

        var params = {
            hostname: conf.API_YOUTU_SERVER,
            port: conf.API_YOUTU_PORT,
            path: '/youtu/api/faceidentify',
            method: 'POST',
            headers: {
                'Authorization': sign,
                'User-Agent'   : conf.USER_AGENT(),
                'Content-Length': request_body.length,
                'Content-Type': 'text/json'
            }                
        };
        

        var request = http.request(params, function(response) {
        
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
       
         
        request.on('error', function(e) {
             callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
        });

        // send the request body
        request.end(request_body);
        
    });
}


/**
 *  newperson
 */
exports.newperson= function(image_a, person_id, group_ids, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    

    fs.readFile(image_a, function (err_a, data_a){

         // 文件　读取　异常
        if(err_a) {
            callback({'httpcode':0, 'code':-1, 'message': image_a + ":" + err_a.message, 'data':{}});
            return;
        };

        var request_body = JSON.stringify({
            app_id: conf.APPID,
            image : data_a.toString('base64'),
            person_id : person_id,
            group_ids : group_ids,
        });

        var params = {
            hostname: conf.API_YOUTU_SERVER,
            port: conf.API_YOUTU_PORT,
            path: '/youtu/api/newperson',
            method: 'POST',
            headers: {
                'Authorization': sign,
                'User-Agent'   : conf.USER_AGENT(),
                'Content-Length': request_body.length,
                'Content-Type': 'text/json'
            }                
        };
        

        var request = http.request(params, function(response) {
        
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
       
         
        request.on('error', function(e) {
             callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
        });

        // send the request body
        request.end(request_body);
        
    });
}



/**
 *  delperson
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


    var request = http.request(params, function(response) {

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

     
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}



/**
 * addface 
 *   person_id : the persion of the face to be added
 *   iamges   :  image files array to be added
 */
 exports.addface = function(person_id, images, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
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
    
    
    var request_body = JSON.stringify({
        app_id: conf.APPID,
        images : image_bufs,
        person_id : person_id,
    });
    
    console.log(request_body);

    var params = {
        hostname: conf.API_YOUTU_SERVER,
        port: conf.API_YOUTU_PORT,
        path: '/youtu/api/addface',
        method: 'POST',
        headers: {
        'Authorization': sign,
        'User-Agent'   : conf.USER_AGENT(),
        'Content-Length': request_body.length,
        'Content-Type': 'text/json'
        }                
    };


    var request = http.request(params, function(response) {

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

     
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);


}

 
 /**
 * delface
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
        port: conf.API_YOUTU_PORT,
        path: '/youtu/api/delface',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };


    var request = http.request(params, function(response) {

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

     
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}


/**
 *  setinfo
 */
exports.setinfo = function(person_name, person_id, callback) {

    callback = callback || function(ret){console.log(ret)};

    var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;
    var sign  = auth.appSign(expired);
    
    
    var request_body = JSON.stringify({
        app_id: conf.APPID,
        person_name: person_name,
        person_id : person_id,
    });

    var params = {
        hostname: conf.API_YOUTU_SERVER,
        port: conf.API_YOUTU_PORT,
        path: '/youtu/api/setinfo',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };


    var request = http.request(params, function(response) {

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

     
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}




/**
 *  getinfo
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
        port: conf.API_YOUTU_PORT,
        path: '/youtu/api/getinfo',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };


    var request = http.request(params, function(response) {

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

     
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}


/**
 *  getgroupids
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
        port: conf.API_YOUTU_PORT,
        path: '/youtu/api/getgroupids',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };


    var request = http.request(params, function(response) {

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

     
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}


/**
 *  getpersonIds
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


    var request = http.request(params, function(response) {

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

     
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}



/**
 *  getfaceIds
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
        port: conf.API_YOUTU_PORT,
        path: '/youtu/api/getfaceids',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };


    var request = http.request(params, function(response) {

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

     
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}



/**
 *  getfaceIds
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
        port: conf.API_YOUTU_PORT,
        path: '/youtu/api/getfaceinfo',
        method: 'POST',
        headers: {
            'Authorization': sign,
            'User-Agent'   : conf.USER_AGENT(),
            'Content-Length': request_body.length,
            'Content-Type': 'text/json'
        }
    };


    var request = http.request(params, function(response) {

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

     
    request.on('error', function(e) {
         callback({'httpcode': 0, 'code': 0, 'message':e.message, 'data': {}});
    });

    // send the request body
    request.end(request_body);
}



