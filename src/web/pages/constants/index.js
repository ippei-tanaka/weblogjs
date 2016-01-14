import keyMirror from 'keymirror';

const constants = Object.freeze({

    Actions: keyMirror({

        USERS_LOADED: null,

        USER_CREATE_REQUEST: null,
        USER_CREATE_FAILED: null,
        USER_CREATED: null,

        USER_UPDATE_REQUEST: null,
        USER_UPDATE_FAILED: null,
        USER_UPDATED: null,

        USER_DELETE_REQUEST: null,
        USER_DELETE_FAILED: null,
        USER_DELETED: null,


        CATEGORIES_LOADED: null,

        CATEGORY_CREATE_REQUEST: null,
        CATEGORY_CREATE_FAILED: null,
        CATEGORY_CREATED: null,

        CATEGORY_UPDATE_REQUEST: null,
        CATEGORY_UPDATE_FAILED: null,
        CATEGORY_UPDATED: null,

        CATEGORY_DELETE_REQUEST: null,
        CATEGORY_DELETE_FAILED: null,
        CATEGORY_DELETED: null

    }),

    PayloadSources: keyMirror({
        VIEW: null,
        SERVER: null
    })

});


export default constants;

export let Actions = constants.Actions;