import ajax from "./ajax";

export const getFromServer = ({path}) => ajax({
    url: path,
    method: 'get'
});

export const postOnServer = ({path, data}) => ajax({
    url: path,
    method: 'post',
    data
});

export const putOneOnServer = ({path, data}) => ajax({
    url: path,
    method: 'put',
    data
});

export const deleteOnServer = ({path}) => ajax({
    url: path,
    method: 'delete'
});
