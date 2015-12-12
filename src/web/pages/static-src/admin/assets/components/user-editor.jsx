import ServerFacade from '../services/server-facade';
import UserAdder from './user-adder';


class UserEditor extends UserAdder {

    get title() {
        return "Edit the User";
    }

    get okayButtonLabel() {
        return "Edit";
    }

    get fieldSettings() {
        var settings = super.fieldSettings;

        delete settings.password;

        return settings;
    }

    retrieveModel(id) {
        return ServerFacade.getUser(id).then(data => {
            return {
                email: data.email,
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

        return ServerFacade.updateUser(id, data);
    }
}


export default UserEditor;