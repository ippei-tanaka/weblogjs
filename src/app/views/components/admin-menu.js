import React from 'react';
import { Link, IndexLink } from 'react-router';
import { ADMIN_DIR } from '../constants/config';
import classNames from 'classnames';

const AdminMenu = ({
    onLinkClick,
    onLogoutClick,
    onToggleClick,
    onFirstElementFocus,
    onLastElementFocus,
    mobileMenuVisible
    }) => (
    <nav className="module-navigation">
        <div tabIndex="0"
             onFocus={onFirstElementFocus}
             className={classNames("m-nvg-mobile-tab-stopper", {"m-nvg-stopper-show": mobileMenuVisible})}
        ></div>
        <button onClick={onToggleClick}
                data-weblog="m-nvg-toggle-button"
                className="module-button m-btn-clear m-nvg-button m-nvg-toggle">
            <i className="fa fa-bars m-nvg-icon"/>
        </button>
        <menu className={classNames("m-nvg-menu", {"m-nvg-mobile-menu-show": mobileMenuVisible})}>
            <li>
                <IndexLink className="module-button m-btn-clear m-nvg-button"
                           onClick={onLinkClick}
                           to={`${ADMIN_DIR}`}>
                    <i className="fa fa-home m-nvg-icon"/>Dashboard
                </IndexLink>
            </li>
            <li>
                <Link className="module-button m-btn-clear m-nvg-button"
                      onClick={onLinkClick}
                      to={`${ADMIN_DIR}/users`}>
                    <i className="fa fa-user m-nvg-icon"/>Users
                </Link>
            </li>
            <li>
                <Link className="module-button m-btn-clear m-nvg-button"
                      onClick={onLinkClick}
                      to={`${ADMIN_DIR}/categories`}>
                    <i className="fa fa-object-group m-nvg-icon"/>Categories
                </Link>
            </li>
            <li>
                <Link className="module-button m-btn-clear m-nvg-button"
                      onClick={onLinkClick}
                      to={`${ADMIN_DIR}/blogs`}>
                    <i className="fa fa-th-large m-nvg-icon"/>Blogs
                </Link>
            </li>
            <li>
                <Link className="module-button m-btn-clear m-nvg-button"
                      onClick={onLinkClick}
                      to={`${ADMIN_DIR}/posts`}>
                    <i className="fa fa-newspaper-o m-nvg-icon"/>Posts
                </Link>
            </li>
            <li>
                <Link className="module-button m-btn-clear m-nvg-button"
                      onClick={onLinkClick}
                      to={`${ADMIN_DIR}/setting`}>
                    <i className="fa fa-cog m-nvg-icon"/>Setting
                </Link>
            </li>
            <li>
                <button className="module-button m-btn-clear m-nvg-button"
                        data-weblog="m-nvg-log-out-button"
                        onClick={onLogoutClick}>
                    <i className="fa fa-sign-out m-nvg-icon"/>Log out
                </button>
            </li>
        </menu>
        <div tabIndex="0"
             onFocus={onLastElementFocus}
             className={classNames("m-nvg-mobile-tab-stopper", {"m-nvg-stopper-show": mobileMenuVisible})}
        ></div>
    </nav>
);

export default AdminMenu;