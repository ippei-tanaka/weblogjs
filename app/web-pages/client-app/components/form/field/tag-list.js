import React from 'react';
import classnames from 'classnames';


const ENTER = 13;


class TagList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tags: []
        }
    }

    componentDidMount() {
        this.setState({
            tags: this.props.value || []
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            tags: newProps.value || []
        });
    }

    render() {
        return (
            <div className="element-tag-list-field">
                <div className="e-tgl-new-tag-list-container">
                    { this.state.tags.length > 0 ? (
                    <ul className="e-tgl-new-tag-list">
                        {this.state.tags.map((tag, index) =>
                        <li key={index}
                            className="e-tgl-new-tag-list-item">
                            <span className="e-tgl-tag-name">{tag}</span>
                            <button className="module-button m-btn-clear"
                                    data-tag-name={tag}
                                    onClick={this.onCloseButtonClicked.bind(this)}>
                                <i className="fa fa-times-circle e-tgl-delete-icon"/>
                            </button>
                        </li>
                            )}
                    </ul>
                        ) : (
                    <span className="e-tgl-no-tags-message">(No Tags)</span>
                        )}

                </div>
                <div className="e-tgl-new-tag-input-container">
                    <input type="text"
                           placeholder="Add a new tag"
                           ref="newTag"
                           id={this.props.id}
                           autoFocus={this.props.autoFocus}
                           onKeyDown={this.onKeyDowned.bind(this)}/>
                    <div className="e-tgl-add-button-container">
                        <button className="module-button m-btn-clear"
                                onClick={this.onAddButtonClicked.bind(this)}>
                            <i className="fa fa-plus-square e-tgl-add-icon"/>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    onKeyDowned(e) {
        if (e.keyCode == ENTER) {
            e.preventDefault();
            this.addNewTag();
        }
    }

    onAddButtonClicked(e) {
        e.preventDefault();
        this.addNewTag();
    }

    onCloseButtonClicked(e) {
        e.preventDefault();
        this.deleteTag(e.currentTarget.getAttribute("data-tag-name"));
    }

    addNewTag() {
        var tag = this.refs.newTag.value.trim();

        if (tag !== "") {
            this.setState(state => {
                if (state.tags.indexOf(tag) === -1) {
                    state.tags.push(tag);
                }
                this.refs.newTag.value = "";
            }, () => {
                this.props.onChange(this.state.tags);
            });
        }
    }

    deleteTag(tag) {
        var index = this.state.tags.indexOf(tag);
        if (index !== -1) {
            this.setState(state => {
                state.tags.splice(index, 1);
            });
        }
    }

    static get defaultProps() {
        return {
            id: null,
            value: "",
            autoFocus: false,
            onChange: () => {}
        }
    }
}

export default TagList;