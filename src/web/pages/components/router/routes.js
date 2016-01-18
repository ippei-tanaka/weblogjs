import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import App from "../app";
import Admin from "../app/admin";
import DashBoard from "../app/admin/dashboard";
import UserList from "../app/admin/user/user-list";
import UserAdder from "../app/admin/user/user-adder";
import UserEditor from "../app/admin/user/user-editor";
import UserDeleter from "../app/admin/user/user-deleter";
import CategoryList from "../app/admin/category/category-list";
import CategoryAdder from "../app/admin/category/category-adder";
import CategoryEditor from "../app/admin/category/category-editor";
import CategoryDeleter from "../app/admin/category/category-deleter";
import BlogList from "../app/admin/blog/blog-list";
import BlogAdder from "../app/admin/blog/blog-adder";
import BlogEditor from "../app/admin/blog/blog-editor";
import BlogDeleter from "../app/admin/blog/blog-deleter";
import PostList from "../app/admin/post/post-list";
import PostAdder from "../app/admin/post/post-adder";
import PostEditor from "../app/admin/post/post-editor";
import PostDeleter from "../app/admin/post/post-deleter";
import SettingEditor from "../app/admin/setting/setting-editor";

var appRoutes = (
    <Route path="/" component={App}>
        <Route path="admin" component={Admin}>
            <IndexRoute component={DashBoard} />
            <Route path="users">
                <IndexRoute component={UserList} />
                <Route path="adder" component={UserAdder} />
                <Route path=":id/editor" component={UserEditor}/>
                <Route path=":id/deleter" component={UserDeleter}/>
            </Route>
            <Route path="categories">
                <IndexRoute component={CategoryList} />
                <Route path="adder" component={CategoryAdder} />
                <Route path=":id/editor" component={CategoryEditor}/>
                <Route path=":id/deleter" component={CategoryDeleter}/>
            </Route>
            <Route path="blogs">
                <IndexRoute component={BlogList} />
                <Route path="adder" component={BlogAdder} />
                <Route path=":id/editor" component={BlogEditor}/>
                <Route path=":id/deleter" component={BlogDeleter}/>
            </Route>
            <Route path="posts">
                <IndexRoute component={PostList} />
                <Route path="adder" component={PostAdder} />
                <Route path=":id/editor" component={PostEditor}/>
                <Route path=":id/deleter" component={PostDeleter}/>
            </Route>
            <Route path="setting">
                <IndexRoute component={SettingEditor} />
            </Route>
        </Route>
    </Route>
);


export { appRoutes };