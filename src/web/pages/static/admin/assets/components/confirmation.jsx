"use strict";

define([
        'react'],
    function (React) {

        var Confirmation = React.createClass({

            getDefaultProps: function () {
                return {
                    mode: "", // 'choose' or 'confirm'
                    okayLabel: "Okay",
                    cancelLabel: "Cancel",
                    onApproved: function () {
                    },
                    onCanceled: function () {
                    }
                };
            },

            render: function () {
                return (
                    <div className="module-confirmation">
                        <p className="m-cfm-message">{this.props.children}</p>
                        <ul className="m-cfm-button-list">
                            <li className="m-cfm-button-list-item">
                                <button className="module-button"
                                        onClick={this.onClickOkay}>{this.props.okayLabel}</button>
                            </li>
                            {this.props.mode === "choose" ? (
                                <li className="m-cfm-button-list-item">
                                    <button ref={this._autoFocus} className="module-button m-btn-alert"
                                            onClick={this.onClickCancel}>{this.props.cancelLabel}</button>
                                </li>
                            ) : null}
                        </ul>
                    </div>
                );
            },

            _autoFocus: function (input) {
                if (input != null) {
                    input.focus();
                }
            },

            onClickOkay: function (e) {
                e.preventDefault();
                this.props.onApproved.call(null);
            },

            onClickCancel: function (e) {
                e.preventDefault();
                this.props.onCanceled.call(null);
            }
        });

        return Confirmation;
    });

