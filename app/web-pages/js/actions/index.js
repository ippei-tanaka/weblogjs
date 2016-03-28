import * as authActions from './auth';
import * as errorActions from './error';
import * as userActions from './user';

export default Object.assign({}, authActions, errorActions, userActions);