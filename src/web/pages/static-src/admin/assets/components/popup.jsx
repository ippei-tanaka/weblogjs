import React from 'react';

var PopUp = React.createClass({

    render: function () {
        return (
            <div className="module-popup">
                <div className="m-ppp-wrapper1">
                    <div className="m-ppp-wrapper2">
                        <div className="m-ppp-frame">
                            <button className="module-button m-btn-clear m-ppp-close-button"
                                    onClick={this._onClickCloseButton}><i
                                className="fa fa-times m-ppp-close-icon"></i>
                            </button>
                            <div className="m-ppp-content-container">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="m-ppp-background" onClick={this._onClickBackground}></div>
            </div>
        );
    },

    _onClickBackground: function (e) {
        e.preventDefault();
        this._close();
    },

    _onClickCloseButton: function (e) {
        e.preventDefault();
        this._close();
    },

    _close: function () {
        this.props.onClosed.call(null);
    }

});

export default PopUp;