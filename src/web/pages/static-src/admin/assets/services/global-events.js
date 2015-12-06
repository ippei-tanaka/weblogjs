import Event from './event';

var events = Object.freeze({
    userCreated: new Event(),
    userUpdated: new Event(),
    userDeleted: new Event(),
    categoryCreated: new Event(),
    categoryUpdated: new Event(),
    categoryDeleted: new Event(),
    postCreated: new Event(),
    postUpdated: new Event(),
    postDeleted: new Event(),
    blogCreated: new Event(),
    blogUpdated: new Event(),
    blogDeleted: new Event(),
    domReady: new Event()
});

document.addEventListener("DOMContentLoaded", function() {
    events.domReady.fire();
});

export default events;