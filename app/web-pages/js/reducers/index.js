import { combineReducers } from 'redux';
import userReducer from './user-reducer';
import categoryReducer from './category-reducer';
import blogReducer from './blog-reducer';
import postReducer from './post-reducer';
import settingReducer from './setting-reducer';
import authReducer from './auth-reducer';
import transactionReducer from './transaction-reducer';
import publicBlogReducer from './public-blog-reducer';
import publicPostReducer from './public-post-reducer';
import publicCategoryReducer from './public-category-reducer';

export default combineReducers({
    user: userReducer,
    category: categoryReducer,
    blog: blogReducer,
    post: postReducer,
    setting: settingReducer,
    auth: authReducer,
    transaction: transactionReducer,
    publicBlog: publicBlogReducer,
    publicPost: publicPostReducer,
    publicCategory: publicCategoryReducer
});