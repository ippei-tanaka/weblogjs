"use strict";

define(['event'], function (Event) {

    return {
        userCreated: new Event(),
        userUpdated: new Event(),
        userDeleted: new Event()
    };
});
