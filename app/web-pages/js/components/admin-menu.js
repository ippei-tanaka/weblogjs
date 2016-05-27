import React from 'react';
import { Link, IndexLink } from 'react-router';
import { ADMIN_DIR } from '../constants/config';

const AdminMenu = ({onLogoutClick}) => (
    <menu>
        <li>
            <button onClick={onLogoutClick}>Log out</button>
        </li>
        <li><IndexLink to={`${ADMIN_DIR}`}>Dashboard</IndexLink></li>
        <li><Link to={`${ADMIN_DIR}/users`}>Users</Link></li>
        <li><Link to={`${ADMIN_DIR}/categories`}>Categories</Link></li>
        <li><Link to={`${ADMIN_DIR}/blogs`}>Blogs</Link></li>
        <li><Link to={`${ADMIN_DIR}/posts`}>Posts</Link></li>
        <li><Link to={`${ADMIN_DIR}/setting`}>Setting</Link></li>
    </menu>
);

export default AdminMenu;