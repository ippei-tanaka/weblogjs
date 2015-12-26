import Deleter from '../../../abstructs/deleter';
import ServerFacade from '../../../../services/server-facade';

class UserDeleter extends Deleter {

    retrieveLabel(id) {
        return ServerFacade.getUser(id).then(user => {
            return user.display_name;
        });
    }

    deleteModel(id) {
        return ServerFacade.deleteUser(id);
    }

    get title() {
        return "Delete User";
    }

    get pageTitle() {
        return "Delete User";
    }
}


export default UserDeleter;