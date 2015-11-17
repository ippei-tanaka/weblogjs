"use strict";

define(['react', 'react-dom', 'jquery'], function (React, ReactDom, $) {

    /**
     * @param ReactClass {Object}
     * @param [containerName] {String}
     * @param [props] {Object}
     * @constructor
     */
    var Mounter = function ReactComponentMounter(ReactClass, containerName, props, children) {
        this.ReactClass = ReactClass;
        this._containerName = containerName || "";
        this._props = props || {};
        this._children = children || null;
    };

    Mounter.prototype = {

        get container() {
            return this.containerName ? Mounter.select(this.containerName) : null;
        },

        set containerName (name) {
            this._containerName = name;
        },

        get containerName () {
            return this._containerName;
        },

        set props (props) {
            this._props = props;
        },

        get props () {
            return this._props;
        },

        set children (children) {
            this._children = children;
        },

        get children () {
            return this._children;
        },

        mount: function () {
            Mounter.mountComponent(this.build(), this.container);
        },

        build: function () {
            return Mounter.createComponent(this.ReactClass, this.props, this.children);
        },

        unmount: function () {
            Mounter.unmountComponentsAt(this.container);
        }
    };

    /**
     * Find an element by the value of data-react
     * @param name {string}
     * @param [ancestor] {Element}
     * @returns {Element}
     */
    Mounter.select = function (name, ancestor) {
        ancestor = ancestor || document;
        return ancestor.querySelector("[data-react='" + name + "']");
    };

    /**
     * Mount the React element to the container
     * @param reactComponent {Object}
     * @param container {Element}
     */
    Mounter.mountComponent = function (reactComponent, container) {
        ReactDom.render(reactComponent, container);
    };

    /**
     * Create a React component
     * @param reactClass {Object}
     * @param [props] {Object}
     * @param [children] {Object}
     * @returns {Object}
     */
    Mounter.createComponent = function (reactClass, props, children) {
        return React.createElement(reactClass, props, children);
    };

    /**
     * Unmount React components from container
     * @param container {Element}
     */
    Mounter.unmountComponentsAt = function (container) {
        ReactDom.unmountComponentAtNode(container);
    };

    return Mounter;

});
