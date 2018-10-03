var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../voltron-8be1.zip');
var kuduApi = 'https://voltron-8be1.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$voltron-8be1';
var password = 'H6t9F60BaRdAoNHkmTnqhXmdugeMNSJ2TAA0adfyllnujcoecoKsbo6cc6Gb';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('voltron-8be1 publish');
  } else {
    console.error('failed to publish voltron-8be1', err);
  }
});