import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import Admin from "../containers/app/admin";
import AdminWrapper from "../containers/app/admin/wrapper";
import DashBoard from "../containers/app/admin/dashboard";
import UserList from "../containers/app/admin/user/user-list";
import UserAdder from "../containers/app/admin/user/user-adder";
import UserEditor from "../containers/app/admin/user/user-editor";
import UserPasswordEditor from "../containers/app/admin/user/user-password-editor";
import UserDeleter from "../containers/app/admin/user/user-deleter";
import CategoryList from "../containers/app/admin/category/category-list";
import CategoryAdder from "../containers/app/admin/category/category-adder";
import CategoryEditor from "../containers/app/admin/category/category-editor";
import CategoryDeleter from "../containers/app/admin/category/category-deleter";
import BlogList from "../containers/app/admin/blog/blog-list";
import BlogAdder from "../containers/app/admin/blog/blog-adder";
import BlogEditor from "../containers/app/admin/blog/blog-editor";
import BlogDeleter from "../containers/app/admin/blog/blog-deleter";
import PostList from "../containers/app/admin/post/post-list";
import PostAdder from "../containers/app/admin/post/post-adder";
import PostEditor from "../containers/app/admin/post/post-editor";
import PostDeleter from "../containers/app/admin/post/post-deleter";
import SettingEditor from "../containers/app/admin/setting/setting-editor";
import { ADMIN_DIR } from "../constants/config";

const routes = (
    <Route path={ADMIN_DIR} component={Admin}>
        <Route component={AdminWrapper}>
            <IndexRoute component={DashBoard}/>
            <Route path="users">
                <IndexRoute component={UserList}/>
                <Route path="adder" component={UserAdder}/>
                <Route path=":id/editor" component={UserEditor}/>
                <Route path=":id/password-editor" component={UserPasswordEditor}/>
                <Route path=":id/deleter" component={UserDeleter}/>
            </Route>
            <Route path="categories">
                <IndexRoute component={CategoryList}/>
                <Route path="adder" component={CategoryAdder}/>
                <Route path=":id/editor" component={CategoryEditor}/>
                <Route path=":id/deleter" component={CategoryDeleter}/>
            </Route>
            <Route path="blogs">
                <IndexRoute component={BlogList}/>
                <Route path="adder" component={BlogAdder}/>
                <Route path=":id/editor" component={BlogEditor}/>
                <Route path=":id/deleter" component={BlogDeleter}/>
            </Route>
            <Route path="posts">
                <IndexRoute component={PostList}/>
                <Route path="adder" component={PostAdder}/>
                <Route path=":id/editor" component={PostEditor}/>
                <Route path=":id/deleter" component={PostDeleter}/>
            </Route>
            <Route path="setting">
                <IndexRoute component={SettingEditor}/>
            </Route>
        </Route>
    </Route>
);

export default routes;