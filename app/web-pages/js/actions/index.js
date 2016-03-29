import * as authActions from './auth';
import * as transactionActions from './transaction';
import * as userActions from './user';

export default Object.assign({}, authActions, transactionActions, userActions);