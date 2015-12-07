import React from 'react';
import classNames from 'classnames';
import NavItems from './nav-items';


class Navigation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mobileMenu: false
        };

        this._menuTimer = null;
    }

    render() {
        return (
            <nav className="module-navigation">
                <button onClick={this._onToggleClicked.bind(this)}
                        onBlur={this._onToggleBlurred.bind(this)}
                        tabIndex="2"
                        data-react="navigation-toggle"
                        className="module-button m-btn-clear m-nvg-button m-nvg-toggle">
                    <i className="fa fa-bars m-nvg-icon"></i>
                </button>
                <menu className={classNames("m-nvg-menu", {"m-nvg-mobile-menu-show": this.state.mobileMenu})}>
                    {NavItems.map(function (item, index) {
                        return (
                        <li className="m-nvg-menu-item"
                            key={item.name}>
                            <a className="module-button m-btn-clear m-nvg-button"
                               href={this.props.hrefs[item.name]}
                               tabIndex={index + 3}
                               data-react-navigation-link
                               onFocus={this._onLinkFocused.bind(this)}
                               onClick={this._onLinkClicked.bind(this)}
                               onBlur={this._onLinkBlurred.bind(this)}>
                                <i className={classNames("fa", "m-nvg-icon", "fa-" + item.icon)} />
                                {item.label}
                            </a>
                        </li>
                            );
                        }.bind(this))}
                </menu>
            </nav>
        );
    }

    _onToggleClicked(e) {
        e.preventDefault();
        this.setState({
            mobileMenu: !this.state.mobileMenu
        });
    }

    _onToggleBlurred() {
        this._throttleMobileMenuValue(false);
    }

    _onLinkClicked() {
        this._throttleMobileMenuValue(false);
    }

    _onLinkFocused() {
        this._throttleMobileMenuValue(true);
    }

    _onLinkBlurred() {
        this._throttleMobileMenuValue(false);
    }

    _throttleMobileMenuValue(value) {
        if (this._menuTimer) {
            window.clearTimeout(this._menuTimer);
        }

        this._menuTimer = window.setTimeout(function () {
            this.setState({
                mobileMenu: value
            });
        }.bind(this), 10);
    }
}


export default Navigation;