import React, { Component } from 'react';
import { Link } from 'react-router';

const List = ({ title, adderLocation, fields, models, editorLocationBuilder, deleterLocationBuilder }) => (
    <div className="module-data-list">
        <h2 className="m-dtl-title">{title}</h2>
        <div>
            <Link className="module-button m-btn-clear m-dtl-add-button"
                  title="Add"
                  to={adderLocation}>
                <i className="fa fa-plus-square-o m-dtl-add-icon"/>
                Add
            </Link>
        </div>
        <table className="m-dtl-table">
            <thead>
            <tr>
                <th></th>
                <th></th>
                {Object.keys(fields).map((key, index) => <th
                    key={index}>{fields[key].label}</th>)}
            </tr>
            </thead>
            <tbody>
            {models.map((model, index) =>
            {
                const values = {};

                Object.keys(fields).forEach(key =>
                {
                    const field = fields[key];
                    const value = model[key];
                    values[key] = field.stringify ? field.stringify(value) : value;
                });

                return <ListItem key={model._id}
                                 values={values}
                                 fields={fields}
                                 editorLocation={editorLocationBuilder(model._id)}
                                 deleterLocation={deleterLocationBuilder(model._id)}
                                 number={index+1}/>;
            })}
            </tbody>
        </table>
    </div>
);


const ListItem = ({ number, editorLocation, deleterLocation, fields, values }) => (
    <tr>
        <td data-label="No.">{number}</td>

        <td className="m-dtl-no-wrap">
            <ul className="m-dtl-button-list">
                <li className="m-dtl-button-list-item">
                    <Link to={editorLocation}
                          className="module-button m-btn-clear">
                        <i title="Edit" className="fa fa-pencil-square-o m-dtl-edit-icon"/>Edit
                    </Link>
                </li>
                <li className="m-dtl-button-list-item">
                    <Link to={deleterLocation}
                          className="module-button m-btn-clear">
                        <i title="Delete" className="fa fa-trash-o m-dtl-delete-icon"/>Delete
                    </Link>
                </li>
            </ul>
        </td>

        {Object.keys(fields).map((key, index) =>
        {
            var field = fields[key];
            var value = values[key];

            return <td data-label={field.label} key={index}>{value}</td>;
        })}

    </tr>
);


export default List;