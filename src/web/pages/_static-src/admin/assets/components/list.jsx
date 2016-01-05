import React from 'react';
import Moment from 'moment';


class List extends React.Component {

    constructor(props) {
        super(props);

        this.state = this.initialState;
    }

    componentWillMount() {
        this.retrieveModels()
            .then((value) => this.setState({models: value}))
            .catch(data => console.error(data));
    }

    render() {
        return (
            <div className="module-data-list">
                <h2 className="m-dtl-title">{this.title}</h2>
                <div>
                    <button className="module-button m-btn-clear m-dtl-add-button"
                            onClick={this.onAddButtonClicked.bind(this)}
                            title="Add">
                        <i className="fa fa-plus-square-o m-dtl-add-icon"/>
                        Add
                    </button>
                </div>
                <table className="m-dtl-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th></th>
                        {Object.keys(this.fields).map((key, index) => <th key={index}>{this.fields[key].label}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.models.map((model, index) => {

                        var values = {};

                        Object.keys(this.fields).forEach(key => {
                            var field = this.fields[key];
                            var value = model[key];
                            values[key] = field.stringify ? field.stringify(value) : value;
                            });

                        return <ListItem key={model._id}
                                         id={model._id}
                                         values={values}
                                         fields={this.fields}
                                         onEditButtonClicked={this.props.onEditButtonClicked}
                                         onDeleteButtonClicked={this.props.onDeleteButtonClicked}
                                         number={index+1}/>;
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    get initialState () {
        return {
            models: []
        };
    }

    retrieveModels() {
        return Promise.reject("Implement retrieveModel().");
    }

    onAddButtonClicked(e) {
        e.preventDefault();
        this.props.onAddButtonClicked();
    }

    get title() {
        return "Something";
    }

    get fields() {
        return Promise.reject("Implement fields.");
    }

}


List.defaultProps = {

    onAddButtonClicked: function () {
    },

    onEditButtonClicked: function () {
    },

    onDeleteButtonClicked: function () {
    }

};


class ListItem extends React.Component {

    render() {
        return (
            <tr>
                <td data-label="No.">{this.props.number}</td>

                <td className="m-dtl-no-wrap">
                    <ul className="m-dtl-button-list">
                        <li className="m-dtl-button-list-item">
                            <button className="module-button m-btn-clear"
                                    onClick={this.onEditButtonClicked.bind(this)}>
                                <i title="Edit" className="fa fa-pencil-square-o m-dtl-edit-icon"/>
                            </button>
                        </li>
                        <li className="m-dtl-button-list-item">
                            <button className="module-button m-btn-clear"
                                    onClick={this.onDeleteButtonClicked.bind(this)}>
                                <i title="Delete" className="fa fa-trash-o m-dtl-delete-icon"/>
                            </button>
                        </li>
                    </ul>
                </td>

                {Object.keys(this.props.fields).map((key, index) => {
                    var field = this.props.fields[key];
                    var value = this.props.values[key];

                    return <td data-label={field.label} key={index}>{value}</td>;

                    })}

            </tr>
        );
    }

    onDeleteButtonClicked(e) {
        e.preventDefault();
        this.props.onDeleteButtonClicked(this.props.id);
    }

    onEditButtonClicked(e) {
        e.preventDefault();
        this.props.onEditButtonClicked(this.props.id);
    }

}


ListItem.defaultProps = {

    onEditButtonClicked: function () {
    },

    onDeleteButtonClicked: function () {
    },

    model: null,

    fields: null

};


export default List;