import React from 'react';
import { Link, IndexLink } from 'react-router';

const AdminMenu = ({onLogoutClick}) => (
    <menu>
        <li>
            <button onClick={onLogoutClick}>Log out</button>
        </li>
        <li><IndexLink to="/admin">Dashboard</IndexLink></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/categories">Categories</Link></li>
        <li><Link to="/admin/blogs">Blogs</Link></li>
        <li><Link to="/admin/posts">Posts</Link></li>
        <li><Link to="/admin/setting">Setting</Link></li>
    </menu>
);

export default AdminMenu;