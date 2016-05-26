import * as authActions from './auth';
import * as transactionActions from './transaction';
import * as resourcesActions from './resorces';

export default Object.assign({}, authActions, transactionActions, resourcesActions);