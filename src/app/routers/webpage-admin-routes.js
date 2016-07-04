import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import Admin from "../views/containers/admin";
import AdminWrapper from "../views/containers/admin/wrapper";
import DashBoard from "../views/containers/admin/dashboard";
import UserList from "../views/containers/admin/user/user-list";
import UserAdder from "../views/containers/admin/user/user-adder";
import UserEditor from "../views/containers/admin/user/user-editor";
import UserPasswordEditor from "../views/containers/admin/user/user-password-editor";
import UserDeleter from "../views/containers/admin/user/user-deleter";
import CategoryList from "../views/containers/admin/category/category-list";
import CategoryAdder from "../views/containers/admin/category/category-adder";
import CategoryEditor from "../views/containers/admin/category/category-editor";
import CategoryDeleter from "../views/containers/admin/category/category-deleter";
import BlogList from "../views/containers/admin/blog/blog-list";
import BlogAdder from "../views/containers/admin/blog/blog-adder";
import BlogEditor from "../views/containers/admin/blog/blog-editor";
import BlogDeleter from "../views/containers/admin/blog/blog-deleter";
import PostList from "../views/containers/admin/post/post-list";
import PostAdder from "../views/containers/admin/post/post-adder";
import PostEditor from "../views/containers/admin/post/post-editor";
import PostDeleter from "../views/containers/admin/post/post-deleter";
import SettingEditor from "../views/containers/admin/setting/setting-editor";
import NotFound from "../views/containers/admin/not-found";
import { ADMIN_DIR } from "../views/constants/config";

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
            <Route path="*" component={NotFound} />
        </Route>
    </Route>
);

export default () => routes;