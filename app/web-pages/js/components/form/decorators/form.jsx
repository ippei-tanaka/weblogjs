import React from 'react';

export default class Form extends React.Component {

    render () {
        return (
            <form className="module-data-editor"
                  onSubmit={this.props.onSubmit.bind(this)}>
                {this.props.children}
            </form>
        );
    }

    static get defaultProps() {
        return {
            onSubmit: () => {}
        }
    }

}