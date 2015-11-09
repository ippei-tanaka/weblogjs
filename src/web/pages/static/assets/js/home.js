requirejs([
        'jsx!../components/user-manager'
    ],
    function (UserManager) {
        UserManager.render(document.querySelector("[data-react='user-manager']"));
    });
