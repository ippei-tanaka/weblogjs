"use strict";

define([
        'react',
        'moment',
        'services/global-events',
        'services/event',
        'jquery'],
    function (React,
              Moment,
              GlobalEvents,
              Event,
              $) {

        var url = "/api/v1/categories";

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
                $.ajax({
                    url: url,
                    dataType: 'json',
                    cache: false
                })
                    .then(function (data) {
                        this.setState({
                            categories: data.items
                        });
                    }.bind(this))

                    .fail(function (xhr) {
                        console.error(xhr.responseJSON.errors);
                    }.bind(this));
            },

            render: function () {
                return (
                    <div className="module-category-list">
                        <h2 className="m-cgl-title">Category List</h2>

                        <table className="m-cgl-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th></th>
                                <th></th>
                                <th className="m-cgl-hidden-cell">Created</th>
                                <th className="m-cgl-hidden-cell">Updated</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.categories.map(function (category, index) {
                                return <CategoryListItem key={category._id} category={category} events={this.events} number={index+1}/>;
                            }.bind(this))}
                            </tbody>
                        </table>

                        <div>
                            <button className="module-button m-btn-clear m-cgl-add-button" onClick={this.onAddButtonClicked}><i className="fa fa-plus-square-o m-cgl-add-icon"></i> Add</button>
                        </div>
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
                        <th>{this.props.number}</th>
                        <td>{this.props.category.name}</td>
                        <td>{this.props.category.slug}</td>
                        <td className="m-cgl-center"><button className="module-button m-btn-clear" onClick={this.onEditButtonClicked}><i title="Edit" className="fa fa-pencil-square-o m-cgl-edit-icon"></i></button></td>
                        <td className="m-cgl-center"><button className="module-button m-btn-clear" onClick={this.onDeleteButtonClicked}><i title="Delete" className="fa fa-trash-o m-cgl-delete-icon"></i></button></td>
                        <td className="m-cgl-hidden-cell">{created}</td>
                        <td className="m-cgl-hidden-cell">{updated}</td>
                    </tr>
                );
            },

            onDeleteButtonClicked: function (e) {
                e.preventDefault();
                this.props.events.deleteButtonClicked.fire(this.props.category);
            },

            onEditButtonClicked: function (e) {
                e.preventDefault();
                this.props.events.editButtonClicked.fire(this.props.category);
            }

        });

        return CategoryList;
    });

