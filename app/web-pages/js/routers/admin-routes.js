import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import Admin from "../containers/admin";
import AdminWrapper from "../containers/admin/wrapper";
import DashBoard from "../containers/admin/dashboard";
import UserList from "../containers/admin/user/user-list";
import UserAdder from "../containers/admin/user/user-adder";
import UserEditor from "../containers/admin/user/user-editor";
import UserPasswordEditor from "../containers/admin/user/user-password-editor";
import UserDeleter from "../containers/admin/user/user-deleter";
import CategoryList from "../containers/admin/category/category-list";
import CategoryAdder from "../containers/admin/category/category-adder";
import CategoryEditor from "../containers/admin/category/category-editor";
import CategoryDeleter from "../containers/admin/category/category-deleter";
import BlogList from "../containers/admin/blog/blog-list";
import BlogAdder from "../containers/admin/blog/blog-adder";
import BlogEditor from "../containers/admin/blog/blog-editor";
import BlogDeleter from "../containers/admin/blog/blog-deleter";
import PostList from "../containers/admin/post/post-list";
import PostAdder from "../containers/admin/post/post-adder";
import PostEditor from "../containers/admin/post/post-editor";
import PostDeleter from "../containers/admin/post/post-deleter";
import SettingEditor from "../containers/admin/setting/setting-editor";
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