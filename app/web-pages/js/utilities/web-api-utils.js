import ajax from "./ajax";

const URL_BASE = "/api";

const ajaxRestfulAPI = (uri, options) => {
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

export const loadUsersFromServer = () => ajaxRestfulAPI("/users")
    .then(data => data.items)
    .catch(() => null);

export const editUserOnServer = ({id, data}) => ajaxRestfulAPI("/users/" + id, {
    data: data,
    method: 'put'
})
    .then(user => ({user}))
    .catch(errors => ({errors}));
