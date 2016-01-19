import Request from "request";

var request = Request.defaults({jar: true});


export let req = function (method, path, data, username, password) {
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
                reject({response, body});
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

export let get = req.bind(null, 'get');

export let post = req.bind(null, 'post');

export let put = req.bind(null, 'put');

export let del = req.bind(null, 'delete');

export default { get, post, put, del };