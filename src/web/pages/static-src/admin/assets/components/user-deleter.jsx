import Deleter from './deleter';
import ServerFacade from '../services/server-facade';

class UserDeleter extends Deleter {

    retrieveLabel(id) {
        return ServerFacade.getUser(id).then(user => {
            return user.display_name;
        });
    }

    get title() {
        return "Delete User";
    }

    deleteUser(id) {
        return ServerFacade.deleteUser(id);
    }

}


export default UserDeleter;