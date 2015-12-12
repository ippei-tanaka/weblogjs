import ServerFacade from '../services/server-facade';
import Editor from './editor';


class UserAdder extends Editor {

    get title() {
        return "Create a New User";
    }

    get okayButtonLabel() {
        return "Create";
    }

    get fieldSettings() {
        return {
            email: {
                id: "UserAdderEmailField",
                type: "email",
                label: "Email Address"
            },

            password: {
                id: "UserAdderPasswordField",
                type: "password",
                label: "Password"
            },

            display_name: {
                id: "UserAdderDisplayNameField",
                type: "text",
                label: "Display Name"
            },

            privileges: {
                type: "checkbox-list",
                label: "Privileges",
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

    retrieveModel() {
        return Promise.resolve({
            email: "",
            password: "",
            display_name: "",
            privileges: []
        });
    }

    sendToServer(values) {
        var data = {
            email: values.email.trim(),
            password: values.password.trim(),
            display_name: values.display_name.trim(),
            privileges: values.privileges
        };

        return ServerFacade.createUser(data);
    }
}


export default UserAdder;