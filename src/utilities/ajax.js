import superagent from "superagent";

export default ({method, url, data}) => {

    let requestObject = superagent[method](url).type('json');

    if (data) {
        requestObject = requestObject.send(data);
    }

    return new Promise((resolve, reject) => {
        requestObject.end((error, response) => {
            if (!error) {
                resolve(response.body);
                return;
            }

            if (response && response.body) {
                reject(response.body);
            } else {
                reject(error.stack);
            }
        });
    });
}