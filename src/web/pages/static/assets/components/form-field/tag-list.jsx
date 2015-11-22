"use strict";

define([
        'react',
        'moment-timezone',
        'classnames'
    ],
    function (React, moment, classnames) {

        var ENTER = 13;


        var TagList = React.createClass({

            getDefaultProps: function () {
                return {
                    className: "",
                    value: "",
                    onChange: function () {
                    }
                };
            },

            getInitialState: function () {
                return {
                    tags: []
                };
            },

            componentWillMount: function () {
                this.setState({
                    tags: this.props.value || []
                });
            },

            componentWillReceiveProps: function (newProps) {
                this.setState({
                    tags: newProps.value || []
                });
            },

            render: function () {
                return (
                    <div className={classnames(this.props.className, "element-tag-list-field")}>
                        <div className="e-tgl-new-tag-list-container">
                            { this.state.tags.length > 0 ? (
                                <ul className="e-tgl-new-tag-list">
                                    {this.state.tags.map(function (tag, index) {
                                        return (
                                            <li key={index}
                                                className="e-tgl-new-tag-list-item">
                                                <span className="e-tgl-tag-name">{tag}</span>
                                                <button className="module-button m-btn-clear"
                                                        data-tag-name={tag}
                                                        onClick={this._onCloseButtonClicked}>
                                                    <i className="fa fa-times-circle e-tgl-delete-icon"></i>
                                                </button>
                                            </li>
                                        );
                                    }.bind(this))}
                                </ul>
                            ) : (
                                <span className="e-tgl-no-tags-message">(No Tags)</span>
                            ) }

                        </div>
                        <div className="e-tgl-new-tag-input-container">
                            <input type="text" placeholder="Add a new tag" ref="newTag" onKeyDown={this._onKeyDowned}/>
                            <div className="e-tgl-add-button-container">
                                <button className="module-button m-btn-clear"
                                        onClick={this._onAddButtonClicked}>
                                    <i className="fa fa-plus-square e-tgl-add-icon"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            },

            _onKeyDowned: function (e) {
                if (e.keyCode == ENTER) {
                    e.preventDefault();
                    this._addNewTag();
                }
            },

            _onAddButtonClicked: function (e) {
                e.preventDefault();
                this._addNewTag();
            },

            _onCloseButtonClicked: function (e) {
                e.preventDefault();
                this._deleteTag(e.currentTarget.getAttribute("data-tag-name"));
            },

            _addNewTag: function () {
                var tag = this.refs.newTag.value.trim();

                if (tag !== "") {
                    this.setState(function (state) {
                        if (state.tags.indexOf(tag) === -1) {
                            state.tags.push(tag);
                        }
                        this.refs.newTag.value = "";
                    }.bind(this), function () {
                        this.props.onChange(this.state.tags);
                    }.bind(this));
                }
            },

            _deleteTag: function (tag) {
                var index = this.state.tags.indexOf(tag);
                if (index !== -1) {
                    this.setState(function (state) {
                        state.tags.splice(index, 1);
                    }.bind(this));
                }
            }
        });

        return TagList;

    });
