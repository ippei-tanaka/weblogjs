import db  from './db';
import userManager  from './model-managers/user-manager';
import categoryManager  from './model-managers/category-manager';
import postManager  from './model-managers/post-manager';
import blogManager  from './model-managers/blog-manager';
import settingManager  from './model-managers/setting-manager';
import privileges  from './model-managers/models/privileges';


module.exports = {
    db,
    userManager,
    categoryManager,
    postManager,
    blogManager,
    settingManager,
    privileges
};