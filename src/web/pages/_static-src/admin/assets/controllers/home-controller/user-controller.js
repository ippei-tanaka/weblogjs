import ModelController  from './model-controller';
import UserList         from '../../components/user/user-list';
import UserAdder        from '../../components/user/user-adder';
import UserEditor       from '../../components/user/user-editor';
import UserDeleter      from '../../components/user/user-deleter';


class UserController extends ModelController {

    get List () {
        return UserList;
    }

    get Adder () {
        return UserAdder;
    }

    get Editor () {
        return UserEditor;
    }

    get Deleter () {
        return UserDeleter;
    }

    get modelName() {
        return "User";
    }

}


export default UserController;