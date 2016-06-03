import superagent from "superagent";
import { URL_BASE } from '../constants/config';

export default ({method, url, data}) => {

    let requestObject = superagent[method](URL_BASE + url).type('json');

    if (data) {
        requestObject = requestObject.send(data);
    }

    return new Promise((resolve, reject) => {
        requestObject.end(function (error, response) {
            if (error) {
                reject(response.body);
                return;
            }
            resolve(response.body);
        });
    });
}