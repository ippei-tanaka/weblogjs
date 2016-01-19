import db  from '../../app/db';
import userManager  from '../../app/model-managers/user-manager';
import categoryManager  from '../../app/model-managers/category-manager';
import postManager  from '../../app/model-managers/post-manager';
import blogManager  from '../../app/model-managers/blog-manager';
import settingManager  from '../../app/model-managers/setting-manager';
import privileges  from '../../app/models/privileges';


module.exports = {
    db,
    userManager,
    categoryManager,
    postManager,
    blogManager,
    settingManager,
    privileges
};