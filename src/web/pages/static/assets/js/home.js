requirejs([
        'jsx!components/user-list',
        'jsx!components/user-creator'
    ],
    function (
        UserList,
        UserCreator
    ) {
        UserList.render(document.querySelector("[data-react='user-list']"));
        UserCreator.render(document.querySelector("[data-react='user-creator']"));
    });
