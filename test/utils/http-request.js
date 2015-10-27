"use strict";

var request = require('request');

var req = function (method, path, data, username, password) {
    return new Promise((resolve, reject) => {
        var options = {
            method: method,
            json: true,
            url: path,
            body: data || {}
        };

        var requestObject = request(options, (error, response, body) => {
            if (error) {
                reject(error);
            }

            if (response.statusCode !== 200) {
                console.log(body);
                reject(new Error(`${response.statusCode} ${body}`));
            }

            resolve(body);
        });

        if (username && password) {
            requestObject.auth(
                username,
                password);
        }
    });
};

module.exports = {
    get: req.bind(null, 'get'),
    post: req.bind(null, 'post'),
    put: req.bind(null, 'put'),
    del: req.bind(null, 'delete')
};