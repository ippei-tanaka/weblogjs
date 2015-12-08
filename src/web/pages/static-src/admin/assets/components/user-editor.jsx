import GlobalEvents from '../services/global-events';
import ServerFacade from '../services/server-facade';
import Editor from './editor';


class UserEditor extends Editor {

    get title() {
        return "Edit the User";
    }

    get fieldSettings() {
        return {
            email: {
                id: "UserEditorEmailField",
                type: "email",
                label: "Email Address",
                value: ""
            },

            password: {
                id: "UserEditorPasswordField",
                type: "password",
                label: "Password",
                value: ""
            },

            display_name: {
                id: "UserEditorDisplayNameField",
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

    retrieveModel(id) {
        return ServerFacade.getUser(id).then(data => {
            return {
                email: data.email,
                password: data.password,
                display_name: data.display_name,
                privileges: data.privileges
            }
        });
    }

    sendToServer(values, id) {
        var data = {
            display_name: values.display_name.trim(),
            privileges: values.privileges
        };

        return ServerFacade.updateUser(id, data)
            .then(function () {
                GlobalEvents.userCreated.fire();
            });
    }
}


export default UserEditor;