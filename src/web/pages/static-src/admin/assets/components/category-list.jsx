"use strict";

define([
        'react',
        'moment',
        'services/global-events',
        'services/event',
        'services/server-facade'],
    function (React,
              Moment,
              GlobalEvents,
              Event,
              ServerFacade) {


        var CategoryList = React.createClass({

            getInitialState: function () {
                return {
                    categories: []
                };
            },

            componentDidMount: function () {
                this.events.addButtonClicked.on(this.props.addButtonClicked);
                this.events.editButtonClicked.on(this.props.editButtonClicked);
                this.events.deleteButtonClicked.on(this.props.deleteButtonClicked);

                GlobalEvents.categoryCreated.on(this._retrieveDataAndUpdateList);
                GlobalEvents.categoryUpdated.on(this._retrieveDataAndUpdateList);
                GlobalEvents.categoryDeleted.on(this._retrieveDataAndUpdateList);

                this._retrieveDataAndUpdateList();
            },

            componentWillUnmount: function () {
                GlobalEvents.categoryCreated.off(this._retrieveDataAndUpdateList);
                GlobalEvents.categoryUpdated.off(this._retrieveDataAndUpdateList);
                GlobalEvents.categoryDeleted.off(this._retrieveDataAndUpdateList);
            },

            _retrieveDataAndUpdateList: function () {
                ServerFacade.getCategories()
                    .then(function (data) {
                        this.setState({
                            categories: data
                        });
                    }.bind(this))

                    .fail(function (xhr) {
                        console.error(xhr.responseJSON.errors);
                    }.bind(this));
            },

            render: function () {
                return (
                    <div className="module-data-list">
                        <h2 className="m-dtl-title">Categories</h2>
                        <div>
                            <button className="module-button m-btn-clear m-dtl-add-button"
                                    onClick={this.onAddButtonClicked}
                                    title="Add"
                                >
                                <i  className="fa fa-plus-square-o m-dtl-add-icon"></i>
                                Add
                            </button>
                        </div>
                        <table className="m-dtl-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.categories.map(function (category, index) {
                                return <CategoryListItem key={category._id} category={category} events={this.events}
                                                         number={index+1}/>;
                            }.bind(this))}
                            </tbody>
                        </table>

                    </div>
                );
            },

            onAddButtonClicked: function (e) {
                e.preventDefault();
                this.events.addButtonClicked.fire();
            },

            events: {
                addButtonClicked: new Event(),
                editButtonClicked: new Event(),
                deleteButtonClicked: new Event()
            }
        });

        var CategoryListItem = React.createClass({

            render: function () {

                var created = Moment(this.props.category.created).format("YYYY-MM-DD HH:mm Z");
                var updated = Moment(this.props.category.updated).format("YYYY-MM-DD HH:mm Z");

                return (
                    <tr>
                        <td data-label="No.">{this.props.number}</td>
                        <td data-label="Name">{this.props.category.name}</td>
                        <td data-label="Slug">{this.props.category.slug}</td>
                        <td data-label="Created">{created}</td>
                        <td data-label="Updated">{updated}</td>
                        <td className="m-dtl-no-wrap">
                            <ul className="m-dtl-button-list">
                                <li className="m-dtl-button-list-item">
                                    <button className="module-button m-btn-clear"
                                            onClick={this.onEditButtonClicked}>
                                        <i title="Edit" className="fa fa-pencil-square-o m-dtl-edit-icon"></i>
                                    </button>
                                </li>
                                <li className="m-dtl-button-list-item">
                                    <button className="module-button m-btn-clear"
                                            onClick={this.onDeleteButtonClicked}>
                                        <i title="Delete" className="fa fa-trash-o m-dtl-delete-icon"></i>
                                    </button>
                                </li>
                            </ul>
                        </td>
                    </tr>
                );
            },

            onDeleteButtonClicked: function (e) {
                e.preventDefault();
                this.props.events.deleteButtonClicked.fire(this.props.category._id);
            },

            onEditButtonClicked: function (e) {
                e.preventDefault();
                this.props.events.editButtonClicked.fire(this.props.category._id);
            }

        });

        return CategoryList;
    });

