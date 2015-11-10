requirejs([
        'jsx!components/user-list'
    ],
    function (UserList) {
        UserList.render(document.querySelector("[data-react='user-list']"));
    });
