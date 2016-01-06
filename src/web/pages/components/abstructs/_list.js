import React from 'react';
import Moment from 'moment';
import { Link } from 'react-router';
import Page from './page';


class List extends React.Component {

    render() {
        return (
            <div className="module-data-list">
                <h2 className="m-dtl-title">{this.props.title}</h2>
                <div>
                    <Link className="module-button m-btn-clear m-dtl-add-button"
                          title="Add"
                          to={this.props.adderLocation}>
                        <i className="fa fa-plus-square-o m-dtl-add-icon"/>
                        Add
                    </Link>
                </div>
                <table className="m-dtl-table">
                    <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        {Object.keys(this.props.fields).map((key, index) => <th key={index}>{this.props.fields[key].label}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.models.map((model, index) => {

                        var values = {};

                        Object.keys(this.props.fields).forEach(key => {
                            var field = this.props.fields[key];
                            var value = model[key];
                            values[key] = field.stringify ? field.stringify(value) : value;
                        });

                        return <ListItem key={model._id}
                                         id={model._id}
                                         values={values}
                                         fields={this.props.fields}
                                         editorLocation={this.props.editorLocationBuilder(model._id)}
                                         deleterLocation={this.props.deleterLocationBuilder(model._id)}
                                         number={index+1}/>;
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}


class ListItem extends React.Component {

    static get propTypes() {
        return {
            editorLocation: React.PropTypes.string.isRequired,
            deleterLocation: React.PropTypes.string.isRequired,
            fields: React.PropTypes.object.isRequired,
            values: React.PropTypes.object.isRequired,
            id: React.PropTypes.string.isRequired,
            number: React.PropTypes.number.isRequired
        };
    };

    render() {
        return (
            <tr>
                <td data-label="No.">{this.props.number}</td>

                <td className="m-dtl-no-wrap">
                    <ul className="m-dtl-button-list">
                        <li className="m-dtl-button-list-item">
                            <Link to={this.props.editorLocation}
                                  className="module-button m-btn-clear">
                                <i title="Edit" className="fa fa-pencil-square-o m-dtl-edit-icon"/>Edit
                            </Link>
                        </li>
                        <li className="m-dtl-button-list-item">
                            <Link to={this.props.deleterLocation}
                                  className="module-button m-btn-clear">
                                <i title="Delete" className="fa fa-trash-o m-dtl-delete-icon"/>Delete
                            </Link>
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

}


export default List;