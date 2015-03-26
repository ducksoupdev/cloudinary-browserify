var request = require('superagent');
var sha1 = require('sha1');
var Q = require('q');

var config = {
    x: 'MY-CLOUD-NAME', // cloud name
    y: 'MY-API-KEY', // api_key
    z: 'MY-API-SECRET' // api_secret
};

function getSignature(obj) {
    var params = [];
    params.push('format=' + obj.format);
    params.push('tags=' + obj.tags);
    params.push('timestamp=' + obj.timestamp);
    params.push('type=' + obj.type + config.z);

    var signature = params.join('&');
    return sha1(signature);
}

function readFile(file) {
    var deferred = Q.defer()
    var reader = new FileReader();

    reader.addEventListener('load', function (e) {
        deferred.resolve(e.target.result);
    });

    reader.addEventListener('error', deferred.reject);
    reader.addEventListener('abort', deferred.reject);
    reader.readAsDataURL(file);

    return deferred.promise;
}

function uploadFile(contents) {
    var deferred = Q.defer();

    var imageObj = {
        timestamp: (new Date().getTime() / 1000),
        tags: 'system',
        type: 'private',
        format: 'jpg'
    };

    var postData = {
        file: contents,
        format: imageObj.format,
        api_key: config.y,
        timestamp: imageObj.timestamp,
        signature: getSignature(imageObj),
        tags: imageObj.tags,
        type: imageObj.type
    };

    request
        .post('https://api.cloudinary.com/v1_1/' + config.x + '/image/upload')
        .send(postData)
        .set('Accept', 'application/json')
        .end(function(err, res) {
            if (res.ok) {
                deferred.resolve(res.body);
            } else {
                deferred.reject(err);
            }
        });

    return deferred.promise;
}

var elem = document.querySelector('#upload');
elem.addEventListener('change', function() {
    if (elem.files.length > 0) {
        Array.prototype.forEach.call(elem.files, function(file) {
            // make sure it's an image file first and that it is less than 2MB
            if (/image.*/.test(file.type) && file.size < 2097152) {
                readFile(file)
                    .then(uploadFile)
                    .then(function(result) {
                        var image = new Image();
                        image.src = result.url; // or value.secure_url if https
                        document.querySelector('#target').appendChild(image);
                    }).catch(function(err) {
                        console.error(err);
                    });
            }
        });
    }
});

