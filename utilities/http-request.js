import superagent from "superagent";

const agent = superagent.agent();

export let req = function (method, path, data) {

    let requestObject;

    requestObject = superagent[method](path).type('json');

    agent.attachCookies(requestObject);

    if (data) {
        requestObject = requestObject.send(data);
    }

    return new Promise((resolve, reject) =>
    {
        requestObject.end((error, response) =>
        {
            if (response.statusCode !== 200) {
                reject({response, body: response.body});
                return;
            }

            if (error) {
                throw error;
            }

            agent.saveCookies(response);

            resolve(response.body);
        });
    });
};

export let get = req.bind(null, 'get');

export let post = req.bind(null, 'post');

export let put = req.bind(null, 'put');

export let del = req.bind(null, 'delete');

export default { get, post, put, del };