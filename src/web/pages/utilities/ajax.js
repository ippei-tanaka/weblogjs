import request from "superagent";


export default ({method, url, data}) => {
    var requestObject = request[method](url).type('json');

    if (data) {
        requestObject = requestObject.send(data);
    }

    return new Promise((resolve, reject) => {
        requestObject.end(function (err, res) {
            if (err) {
                reject(res.body);
                return;
            }
            resolve(res.body);
        });
    });
}