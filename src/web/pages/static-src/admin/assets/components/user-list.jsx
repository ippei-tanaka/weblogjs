import Moment from 'moment';
import List from './list';
import ServerFacade from '../services/server-facade';


class UserList extends List {

    retrieveModels() {
        return ServerFacade.getUsers();
    }

    get title() {
        return "User List";
    }

    get fields() {
        return {
            display_name: {
                label: "Name"
            },

            slug: {
                label: "Slug"
            },

            email: {
                label: "Email"
            },

            readable_privileges: {
                label: "Privileges",
                stringify: value =>
                    value.map(p => p.toLowerCase()).join(', ')
            },

            created: {
                label: "Created",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            },

            updated: {
                label: "Updated",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            }
        }
    }

}

export default UserList;