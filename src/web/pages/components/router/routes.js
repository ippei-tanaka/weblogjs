import React from "react";
import ReactDOM from "react-dom";
import { Route, IndexRoute } from 'react-router';
import Router from 'react-router-component';
import App from "../app";
import Admin from "../app/admin";
import DashBoard from "../app/admin/dashboard";
import UserList from "../app/admin/user/user-list";
import UserAdder from "../app/admin/user/user-adder";
import UserEditor from "../app/admin/user/user-editor";
import UserDeleter from "../app/admin/user/user-deleter";


export default (
    <Route path="/" component={App}>
        <Route path="admin" component={Admin}>
            <IndexRoute component={DashBoard} />
            <Route path="users">
                <IndexRoute component={UserList} />
                <Route path="adder" component={UserAdder} />
                <Route path=":id/editor" component={UserEditor}/>
                <Route path=":id/deleter" component={UserDeleter}/>
            </Route>
        </Route>
    </Route>
);