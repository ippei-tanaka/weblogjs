"use strict";

define(['services/event'], function (Event) {

    return {
        userCreated: new Event(),
        userUpdated: new Event(),
        userDeleted: new Event(),
        categoryCreated: new Event(),
        categoryUpdated: new Event(),
        categoryDeleted: new Event()
    };
});
