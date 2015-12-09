import GlobalEvents from '../services/global-events';
import ServerFacade from '../services/server-facade';
import Editor from './editor';


class UserAdder extends Editor {

    get title() {
        return "Create a New User";
    }

    get fieldSettings() {
        return {
            email: {
                id: "UserAdderEmailField",
                type: "email",
                label: "Email Address",
                value: ""
            },

            password: {
                id: "UserAdderPasswordField",
                type: "password",
                label: "Password",
                value: ""
            },

            display_name: {
                id: "UserAdderDisplayNameField",
                type: "text",
                label: "Display Name",
                value: ""
            },

            privileges: {
                type: "checkbox-list",
                label: "Privileges",
                value: [],
                list: () => ServerFacade.getPrivileges().then(
                    privileges => Object.keys(privileges).map(key => {
                        return {
                            value: privileges[key],
                            label: key
                        }
                    })
                )
            }
        }
    }

    sendToServer(values) {
        var data = {
            email: values.email.trim(),
            password: values.password.trim(),
            display_name: values.display_name.trim(),
            privileges: values.privileges
        };

        return ServerFacade.createUser(data)
            .then(function () {
                GlobalEvents.userCreated.fire();
            });
    }
}


export default UserAdder;