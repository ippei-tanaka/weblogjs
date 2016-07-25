import { combineReducers } from 'redux';
import userReducer from './user-reducer';
import categoryReducer from './category-reducer';
import postReducer from './post-reducer';
import settingReducer from './setting-reducer';
import authReducer from './auth-reducer';
import transactionReducer from './transaction-reducer';
import themeReducer from './theme-reducer';

export default combineReducers({
    user: userReducer,
    category: categoryReducer,
    post: postReducer,
    setting: settingReducer,
    auth: authReducer,
    transaction: transactionReducer,
    theme: themeReducer
});