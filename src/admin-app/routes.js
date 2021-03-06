import React from "react";
import { Route, IndexRoute } from 'react-router';
import Admin from "./containers/index";
import AdminWrapper from "./containers/wrapper";
import DashBoard from "./containers/dashboard";
import UserList from "./containers/user/user-list";
import UserAdder from "./containers/user/user-adder";
import UserEditor from "./containers/user/user-editor";
import UserPasswordEditor from "./containers/user/user-password-editor";
import UserDeleter from "./containers/user/user-deleter";
import CategoryList from "./containers/category/category-list";
import CategoryAdder from "./containers/category/category-adder";
import CategoryEditor from "./containers/category/category-editor";
import CategoryDeleter from "./containers/category/category-deleter";
import PostList from "./containers/post/post-list";
import PostAdder from "./containers/post/post-adder";
import PostEditor from "./containers/post/post-editor";
import PostDeleter from "./containers/post/post-deleter";
import SettingEditor from "./containers/setting/setting-editor";
import NotFound from "./containers/not-found";
import config from '../config';

export default (
    <Route path={config.getValue('adminSiteRoot')} component={Admin}>
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