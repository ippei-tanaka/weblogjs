import React from 'react';
import ReactDom from 'react-dom';


class ReactComponentMounter {

    constructor(ReactClass, containerName, props, children) {
        this.ReactClass = ReactClass;
        this._containerName = containerName || "";
        this._props = props || {};
        this._children = children || null;
    }

    get container() {
        return this.containerName ? this.constructor.select(this.containerName) : null;
    }

    set containerName(name) {
        this._containerName = name;
    }

    get containerName() {
        return this._containerName;
    }

    set props(props) {
        this._props = props;
    }

    get props() {
        return this._props;
    }

    set children(children) {
        this._children = children;
    }

    get children() {
        return this._children;
    }

    mount() {
        this.constructor.mountComponent(this.build(), this.container);
    }

    build() {
        return this.constructor.createComponent(this.ReactClass, this.props, this.children);
    }

    unmount() {
        this.constructor.unmountComponentsAt(this.container);
    }

    /**
     * Find an element by the value of data-react
     * @param name {string}
     * @param [ancestor] {Element}
     * @returns {Element}
     */
    static select(name, ancestor) {
        ancestor = ancestor || document;
        return ancestor.querySelector("[data-react='" + name + "']");
    };

    /**
     * Mount the React element to the container
     * @param reactComponent {Object}
     * @param container {Element}
     */
    static mountComponent(reactComponent, container) {
        ReactDom.render(reactComponent, container);
    }

    /**
     * Create a React component
     * @param reactClass {Object}
     * @param [props] {Object}
     * @param [children] {Object}
     * @returns {Object}
     */
    static createComponent(reactClass, props, children) {
        return React.createElement(reactClass, props, children);
    };

    /**
     * Unmount React components from container
     * @param container {Element}
     */
    static unmountComponentsAt(container) {
        ReactDom.unmountComponentAtNode(container);
    }

}


export default ReactComponentMounter;