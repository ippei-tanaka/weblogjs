"use strict";

define([
        'react',
        'react-dom',
        'jquery'],
    function (React, ReactDom, $) {

        var PopUp = React.createClass({

            componentDidMount: function () {

                // TODO: move this to global-events.js
                $(window).on('resize', this._updateSize);
                this._updateSize();
            },

            componentWillUnmount: function () {
                $(window).off('resize', this._updateSize);
            },

            render: function () {
                return (
                    <div className="module-popup">
                        <div className="m-ppp-content-frame">
                            <button className="module-button m-btn-clear m-ppp-close-button"
                                    onClick={this._onClickCloseButton}><i className="fa fa-times m-ppp-close-icon"></i>
                            </button>
                            <div data-react="content-container" className="m-ppp-content-container">
                                {this.props.content}
                            </div>
                        </div>
                        <div className="m-ppp-background" onClick={this._onClickBackground}></div>
                    </div>
                );
            },

            _updateSize: function () {
                // TODO: create a utility module for measuring heights or etc.
                var $this = $(ReactDom.findDOMNode(this));
                var $document = $(document);
                $this.height(($document.height()));
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
                // TODO: User event.js
                this.props.onClosed.call(null);
            }

        });

        return PopUp;

    });
