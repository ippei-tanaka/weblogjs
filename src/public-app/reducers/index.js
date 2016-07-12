import { combineReducers } from 'redux';
import publicBlogReducer from './public-blog-reducer';
import publicPostReducer from './public-post-reducer';
import publicSinglePostReducer from './public-single-post-reducer';
import publicCategoryReducer from './public-category-reducer';
import publicSiteInfoReducer from './public-site-info-reducer';

export default combineReducers({
    publicBlog: publicBlogReducer,
    publicPost: publicPostReducer,
    publicSinglePost: publicSinglePostReducer,
    publicCategory: publicCategoryReducer,
    publicSiteInfo: publicSiteInfoReducer
});