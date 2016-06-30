import { MongoModel } from '../../../../simple-odm';
import Schemas from '../schemas';
import { generateHash, compareHashedStrings } from '../utils';

const schema = Schemas.getSchema('user');

export default class UserModel extends MongoModel {

    static get name () {
        return schema.name;
    }

    static get schema () {
        return schema;
    }

    checkPassword (password)
    {
        return compareHashedStrings(password, this.values.hashed_password);
    }

}