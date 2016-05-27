import request from "superagent";
import { URL_BASE } from "../constants/config";

export default ({method, url, data}) => {
    var requestObject = request[method](URL_BASE + url).type('json');

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