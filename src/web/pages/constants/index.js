import keyMirror from 'keymirror';

const constants = Object.freeze({

    Actions: keyMirror({
        USERS_LOAD_REQUEST: null,
        USERS_LOADED: null,

        USER_CREATE_REQUEST: null,
        USER_CREATE_FAILED: null,
        USER_CREATED: null,

        USER_UPDATE_REQUEST: null,
        USER_UPDATE_FAILED: null,
        USER_UPDATED: null,

        USER_DELETE_REQUEST: null,
        USER_DELETE_FAILED: null,
        USER_DELETED: null
    }),

    PayloadSources: keyMirror({
        VIEW: null,
        MODEL: null,
        SERVER: null
    })

});


export default constants;

export let Actions = constants.Actions;