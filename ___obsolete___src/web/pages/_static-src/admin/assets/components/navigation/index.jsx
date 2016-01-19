import React from 'react';
import classNames from 'classnames';
import NavItems from './nav-items';


class Navigation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mobileMenu: false
        };

        this.menuTimer = null;
    }

    render() {
        return (
            <nav className="module-navigation">
                <button onClick={this.onToggleClicked.bind(this)}
                        onBlur={this.onToggleBlurred.bind(this)}
                        tabIndex="2"
                        data-react="navigation-toggle"
                        className="module-button m-btn-clear m-nvg-button m-nvg-toggle">
                    <i className="fa fa-bars m-nvg-icon"/>
                </button>
                <menu className={classNames("m-nvg-menu", {"m-nvg-mobile-menu-show": this.state.mobileMenu})}>
                    {NavItems.map((item, index) =>
                    <li className="m-nvg-menu-item"
                        key={item.name}>
                        <a className="module-button m-btn-clear m-nvg-button"
                           href={this.props.hrefs[item.name]}
                           tabIndex={index + 3}
                           data-react-navigation-link
                           onFocus={this.onLinkFocused.bind(this)}
                           onClick={this.onLinkClicked.bind(this)}
                           onBlur={this.onLinkBlurred.bind(this)}>
                            <i className={classNames("fa", "m-nvg-icon", "fa-" + item.icon)}/>
                            {item.label}
                        </a>
                    </li>
                        )}
                </menu>
            </nav>
        );
    }

    onToggleClicked(e) {
        e.preventDefault();
        this.setState({
            mobileMenu: !this.state.mobileMenu
        });
    }

    onToggleBlurred() {
        this.throttleMobileMenuValue(false);
    }

    onLinkClicked() {
        this.throttleMobileMenuValue(false);
    }

    onLinkFocused() {
        this.throttleMobileMenuValue(true);
    }

    onLinkBlurred() {
        this.throttleMobileMenuValue(false);
    }

    throttleMobileMenuValue(value) {
        if (this.menuTimer) {
            window.clearTimeout(this.menuTimer);
        }

        this.menuTimer = window.setTimeout(() => {
            this.setState({
                mobileMenu: value
            });
        }, 10);
    }
}


export default Navigation;