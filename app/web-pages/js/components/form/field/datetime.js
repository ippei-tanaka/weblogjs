import React from 'react';
import moment from 'moment';
import classnames from 'classnames';


class Datetime extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            year: "",
            month: "",
            date: "",
            hour: "",
            minute: "",
            utcOffset: ""
        };
    }

    componentDidMount() {
        this.setDateTimeState(this.props.value);
    }

    componentWillReceiveProps(newProps) {
        this.setDateTimeState(newProps.value);
    }

    render() {
        return (
            <div className={classnames(this.props.className, "element-datetime-field")}>
                <fieldset className="e-dtf-field-set">
                    <label className="e-dtf-select-container">
                        <select className="e-dtf-select" value={this.state.month}
                                id={this.props.id}
                                autoFocus={this.props.autoFocus}
                                onChange={this.onValueChanged.call(this, 'month')}>
                            {this.listOfMonths.map((name, index) =>
                            <option value={index + 1} key={index + 1}>{name}</option>
                                )}
                        </select>
                        <small className="e-dtf-label">Month</small>
                    </label>

                    <label className="e-dtf-select-container">
                        <select className="e-dtf-select" value={this.state.date}
                                onChange={this.onValueChanged.call(this, 'date')}>
                            {this.range(1, 31, i =>
                            <option value={i} key={i}>{i}</option>
                                )}
                        </select>
                        <small className="e-dtf-label">Date</small>
                    </label>

                    <label className="e-dtf-select-container">
                        <select className="e-dtf-select" value={this.state.year}
                                onChange={this.onValueChanged.call(this, 'year')}>
                            {this.range(1970, 2100, i =>
                            <option value={i} key={i}>{i}</option>
                                )}
                        </select>
                        <small className="e-dtf-label">Year</small>
                    </label>
                </fieldset>

                <fieldset className="e-dtf-field-set">
                    <label className="e-dtf-select-container">
                        <select className="e-dtf-select" value={this.state.hour}
                                onChange={this.onValueChanged.call(this, 'hour')}>
                            {this.range(0, 23, i =>
                            <option value={i} key={i}>{i}</option>
                                )}
                        </select>
                        <small className="e-dtf-label">Hour</small>
                    </label>
                    <span className="e-dtf-separator">:</span>
                    <label className="e-dtf-select-container">
                        <select className="e-dtf-select" value={this.state.minute}
                                onChange={this.onValueChanged.call(this, 'minute')}>
                            {this.range(0, 59, i =>
                            <option value={i} key={i}>{i}</option>
                                )}
                        </select>
                        <small className="e-dtf-label">Minute</small>
                    </label>
                </fieldset>

                <fieldset className="e-dtf-field-set">
                    <label className="e-dtf-select-container">
                        <select className="e-dtf-select"
                                value={this.state.utcOffset}
                                disabled="true">
                            {this.listOfOffsets.map((offset, index) =>
                            <option value={offset} key={index}>{offset}</option>
                                )}
                        </select>
                        <small className="e-dtf-label">UTC Offset</small>
                    </label>
                </fieldset>
            </div>
        );
    }


    get formats() {
        return {
            year: "YYYY",
            month: "M",
            date: "D",
            hour: "H",
            minute: "m",
            utcOffset: "Z"
        }
    }

    setDateTimeState(dateTimeString) {
        var thisMoment = moment(dateTimeString);
        var newState = {};

        Object.keys(this.formats).forEach(key => {
            newState[key] = thisMoment.format(this.formats[key]);
        });

        this.setState(newState);
    }

    buildDateFromState() {

        var thisMoment = moment({
            year: this.state.year,
            month: this.state.month - 1,
            date: this.state.date,
            hour: this.state.hour,
            minute: this.state.minute,
            second: 0
        });

        return thisMoment.toDate();
    }

    onValueChanged(field) {
        return e => {
            var obj = {};
            obj[field] = e.target.value.trim();
            this.setState(obj, () => {
                this.props.onChange(this.buildDateFromState());
            });
        };
    }

    range(start, end, func) {
        var results = [];
        for (var i = start; i <= end; i++) {
            results.push(func(i));
        }
        return results;
    }

    get listOfMonths() {
        return [
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
        ];
    }

    get listOfOffsets() {
        return [
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
    }

}


Datetime.defaultProps = {
    id: null,
    className: "module-datetime",
    value: null,
    autoFocus: false,
    onChange: function () {
    }
};


export default Datetime;
