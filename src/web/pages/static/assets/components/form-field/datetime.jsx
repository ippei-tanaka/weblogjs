"use strict";

define([
        'react',
        'moment',
        'classnames'
    ],
    function (React, moment, classnames) {

        var Datetime = React.createClass({

            getDefaultProps: function () {
                return {
                    id: "",
                    className: "",
                    value: "",
                    offset: "", // (e.g) "-05:00"
                    onChange: function () {
                    }
                };
            },

            getInitialState: function () {
                return {
                    year: "",
                    month: "",
                    date: "",
                    hour: "",
                    minute: ""
                };
            },

            componentWillMount: function () {
                this._setDateTimeState(this.props.value || new Date());
            },

            componentWillReceiveProps: function (newProps) {
                this._setDateTimeState(newProps.value || new Date());
            },

            render: function () {
                return (
                    <div className={classnames(this.props.className, "element-datetime-field")}>
                        <fieldset className="e-dtf-field-set">
                            <label className="e-dtf-select-container">
                                <select className="e-dtf-select" value={this.state.month}
                                        onChange={this._onChange('month')}>
                                    {this._range(1, 12, function (i) {
                                        return <option value={i} key={i}>{i}</option>
                                    })}
                                </select>
                                <small className="e-dtf-label">Month</small>
                            </label>

                            <label className="e-dtf-select-container">
                                <select className="e-dtf-select" value={this.state.date}
                                        onChange={this._onChange('date')}>
                                    {this._range(1, 31, function (i) {
                                        return <option value={i} key={i}>{i}</option>
                                    })}
                                </select>
                                <small className="e-dtf-label">Date</small>
                            </label>

                            <label className="e-dtf-select-container">
                                <select className="e-dtf-select" value={this.state.year}
                                        onChange={this._onChange('year')}>
                                    {this._range(1900, 2200, function (i) {
                                        return <option value={i} key={i}>{i}</option>
                                    })}
                                </select>
                                <small className="e-dtf-label">Year</small>
                            </label>
                        </fieldset>

                        <fieldset className="e-dtf-field-set">
                            <label className="e-dtf-select-container">
                                <select className="e-dtf-select" value={this.state.hour}
                                        onChange={this._onChange('hour')}>
                                    {this._range(0, 23, function (i) {
                                        return <option value={i} key={i}>{i}</option>
                                    })}
                                </select>
                                <small className="e-dtf-label">Hour</small>
                            </label>
                            <span className="e-dtf-separator">:</span>
                            <label className="e-dtf-select-container">
                                <select className="e-dtf-select" value={this.state.minute}
                                        onChange={this._onChange('minute')}>
                                    {this._range(0, 59, function (i) {
                                        return <option value={i} key={i}>{i}</option>
                                    })}
                                </select>
                                <small className="e-dtf-label">Minute</small>
                            </label>
                        </fieldset>
                    </div>
                );
            },

            _formats: {
                year: "YYYY",
                month: "M",
                date: "D",
                hour: "H",
                minute: "m"
            },

            _setDateTimeState: function (dateTimeString) {
                var thisMoment = moment(dateTimeString).second(0).utc().utcOffset(this.props.offset);
                var newState = {};

                Object.keys(this._formats).forEach(function (key) {
                    newState[key] = thisMoment.format(this._formats[key]);
                }.bind(this));

                this.setState(newState);
            },

            _buildDateFromState: function () {
                var thisMoment = moment().second(0);

                Object.keys(this._formats).forEach(function (key) {
                    thisMoment.set(key, this.state[key]);
                }.bind(this));

                return thisMoment.toDate();
            },

            _onChange: function (field) {
                return function (e) {
                    var obj = {};
                    obj[field] = e.target.value.trim();
                    this.setState(obj, function () {
                        this.props.onChange(this._buildDateFromState());
                    }.bind(this));
                }.bind(this);
            },

            _range: function (start, end, func) {
                var results = [];
                for (var i = start; i <= end; i++) {
                    results.push(func(i));
                }
                return results;
            }

        });

        return Datetime;

    });
