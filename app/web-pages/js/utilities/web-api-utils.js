import ajax from "./ajax";

const URL_BASE = "/api";

var ajaxRestfulAPI = (uri, options) => {
    options = Object.assign({
        url: URL_BASE + uri,
        method: "get"
    }, options);
    return ajax(options);
};

export const getLoginUser = () => ajaxRestfulAPI("/users/me")
    .then(loginUser => loginUser)
    .catch(() => null);


export const loginToAdmin = ({email, password}) => ajaxRestfulAPI("/login", {
    data: {email, password},
    method: 'post'
})
    .then(loginUser => loginUser)
    .catch(() => null);


export const logoutFromAdmin = () => ajaxRestfulAPI("/logout")
    .then(() => true)
    .catch(() => false);


export const getFromServer = ({path}) => ajaxRestfulAPI(path);

export const postOnServer = ({path, data}) =>
    ajaxRestfulAPI(path, {
        data,
        method: 'post'
    });

export const putOneOnServer = ({path, data}) =>
    ajaxRestfulAPI(path, {
        data,
        method: 'put'
    });

export const deleteOnServer = ({path, id}) =>
    ajaxRestfulAPI(path, {
        method: 'delete'
    });
