import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import App from "../containers/app";
import Admin from "../containers/app/admin";
import DashBoard from "../containers/app/admin/dashboard";
import UserList from "../components/app/admin/user/user-list";
//import UserAdder from "../components/app/admin/user/user-adder";
import UserEditor from "../components/app/admin/user/user-editor";
/*
import UserDeleter from "../components/app/admin/user/user-deleter";
import CategoryList from "../components/app/admin/category/category-list";
import CategoryAdder from "../components/app/admin/category/category-adder";
import CategoryEditor from "../components/app/admin/category/category-editor";
import CategoryDeleter from "../components/app/admin/category/category-deleter";
import BlogList from "../components/app/admin/blog/blog-list";
import BlogAdder from "../components/app/admin/blog/blog-adder";
import BlogEditor from "../components/app/admin/blog/blog-editor";
import BlogDeleter from "../components/app/admin/blog/blog-deleter";
import PostList from "../components/app/admin/post/post-list";
import PostAdder from "../components/app/admin/post/post-adder";
import PostEditor from "../components/app/admin/post/post-editor";
import PostDeleter from "../components/app/admin/post/post-deleter";
import SettingEditor from "../components/app/admin/setting/setting-editor";
*/
import Public from "../components/app/public";


const appRoutes = (
    <Route path="/" component={App}>
        <IndexRoute component={Public} />
        <Route path="admin" component={Admin}>
            <IndexRoute component={DashBoard} />
            <Route path="users">
                <IndexRoute component={UserList} />
                <Route path=":id/editor" component={UserEditor}/>
            </Route>
        </Route>
    </Route>
);

/*

const appRoutes = (
    <Route path="/" component={App}>
        <IndexRoute component={Public} />
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

 */

export { appRoutes };