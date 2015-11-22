"use strict";

define([
        'react',
        'moment-timezone',
        'classnames'
    ],
    function (React, moment, classnames) {

        var Datetime = React.createClass({

            getDefaultProps: function () {
                return {
                    id: "",
                    className: "",
                    value: "",
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
                    minute: "",
                    utcOffset: ""
                };
            },

            componentWillMount: function () {
                this._setDateTimeState(this.props.value);
            },

            componentWillReceiveProps: function (newProps) {
                this._setDateTimeState(newProps.value);
            },

            render: function () {
                return (
                    <div className={classnames(this.props.className, "element-datetime-field")}>
                        <fieldset className="e-dtf-field-set">
                            <label className="e-dtf-select-container">
                                <select className="e-dtf-select" value={this.state.month}
                                        id={this.props.id}
                                        onChange={this._onChange('month')}>
                                    {this._listOfMonths.map(function (name, index) {
                                        return <option value={index + 1} key={index + 1}>{name}</option>
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
                                    {this._range(1970, 2100, function (i) {
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

                        <fieldset className="e-dtf-field-set">
                            <label className="e-dtf-select-container">
                                <select className="e-dtf-select"
                                        value={this.state.utcOffset}
                                        disabled="true">
                                    {this._listOfOffsets.map(function (offset, index) {
                                        return <option value={offset} key={index}>{offset}</option>
                                    })}
                                </select>
                                <small className="e-dtf-label">UTC Offset</small>
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
                minute: "m",
                utcOffset: "Z"
            },

            _setDateTimeState: function (dateTimeString) {
                var thisMoment = moment(dateTimeString);
                var newState = {};

                Object.keys(this._formats).forEach(function (key) {
                    newState[key] = thisMoment.format(this._formats[key]);
                }.bind(this));

                this.setState(newState);
            },

            _buildDateFromState: function () {

                var thisMoment = moment({
                    year: this.state.year,
                    month: this.state.month - 1,
                    date: this.state.date,
                    hour: this.state.hour,
                    minute: this.state.minute,
                    second: 0
                });

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
            },

            _listOfMonths: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],

            _listOfOffsets: [
                "-12:00",
                "-11:00",
                "-10:00",
                "-09:30",
                "-09:00",
                "-08:00",
                "-07:00",
                "-06:00",
                "-05:00",
                "-04:30",
                "-04:00",
                "-03:30",
                "-03:00",
                "-02:00",
                "-01:00",
                "+00:00",
                "+01:00",
                "+02:00",
                "+03:00",
                "+03:30",
                "+04:00",
                "+04:30",
                "+05:00",
                "+05:30",
                "+05:45",
                "+06:00",
                "+06:30",
                "+07:00",
                "+08:00",
                "+08:30",
                "+08:45",
                "+09:00",
                "+09:30",
                "+10:00",
                "+10:30",
                "+11:00",
                "+12:00",
                "+12:45",
                "+13:00",
                "+14:00"
            ]
        });

        return Datetime;

    });
