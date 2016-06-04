import React from 'react';
import moment from 'moment';
import classnames from 'classnames';

const listOfMonths = Object.freeze([
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
]);

/*
const listOfOffsets = Object.freeze([
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
]);
*/

const range = (start, end, func) => {
    const results = [];

    for (let i = start; i <= end; i++) {
        results.push(func(i));
    }

    return results;
};

const onValueChanged = (field, onChange, originalValue) =>
{
    return (event) =>
    {
        const value = new Date(originalValue);

        value.setSeconds(0);
        value.setMilliseconds(0);

        switch (field) {
            case 'year':
                value.setFullYear(event.target.value);
                break;
            case 'month':
                value.setMonth(event.target.value - 1);
                break;
            case 'date':
                value.setDate(event.target.value);
                break;
            case 'hours':
                value.setHours(event.target.value);
                break;
            case 'minutes':
                value.setMinutes(event.target.value);
                break;
            default:
                break;
        }

        onChange(value);
    }
};

/*
const createUtcOffsetString = (utcOffset) => {

    const sign = utcOffset >= 0 ? "+" : "-";
    const hours = Math.abs(Math.floor(utcOffset));
    const hourString = ('0' + hours).slice(-2);
    const minutes = 60 * (Math.abs(utcOffset) - Math.abs(Math.floor(utcOffset)));
    const minuteString = ('0' + minutes).slice(-2);

    return `${sign}${hourString}:${minuteString}`;

};
*/

const DateTime = ({
    id = null,
    className = "module-datetime",
    value = null,
    autoFocus = false,
    onChange = () => {}
    }) => {

    if (value === null)
        throw new Error("The value can't be empty.");

    if (!(value instanceof Date))
        throw new Error("The value for DateTime has to be a Date object.");

    const year = value.getFullYear();
    const month = value.getMonth() + 1;
    const date = value.getDate();
    const hours = value.getHours();
    const minutes = value.getMinutes();
    //const utcOffset = -1 * (value.getTimezoneOffset() / 60);
    //const utcOffsetString = createUtcOffsetString(utcOffset);

    return (
        <div className={classnames(className, "element-datetime-field")}>
            <fieldset className="e-dtf-field-set">
                <label className="e-dtf-select-container">
                    <select className="e-dtf-select" value={month}
                            id={id}
                            autoFocus={autoFocus}
                            onChange={onValueChanged('month', onChange, value)}>
                        {listOfMonths.map((name, index) =>
                            <option value={index + 1} key={index + 1}>{name}</option>
                        )}
                    </select>
                    <small className="e-dtf-label">Month</small>
                </label>

                <label className="e-dtf-select-container">
                    <select className="e-dtf-select" value={date}
                            onChange={onValueChanged('date', onChange, value)}>
                        {range(1, 31, i =>
                            <option value={i} key={i}>{i}</option>
                        )}
                    </select>
                    <small className="e-dtf-label">Date</small>
                </label>

                <label className="e-dtf-select-container">
                    <select className="e-dtf-select" value={year}
                            onChange={onValueChanged('year', onChange, value)}>
                        {range(1970, 2100, i =>
                            <option value={i} key={i}>{i}</option>
                        )}
                    </select>
                    <small className="e-dtf-label">Year</small>
                </label>
            </fieldset>

            <fieldset className="e-dtf-field-set">
                <label className="e-dtf-select-container">
                    <select className="e-dtf-select" value={hours}
                            onChange={onValueChanged('hours', onChange, value)}>
                        {range(0, 23, i =>
                            <option value={i} key={i}>{('0' + i).slice(-2)}</option>
                        )}
                    </select>
                    <small className="e-dtf-label">Hours</small>
                </label>
                <span className="e-dtf-separator">:</span>
                <label className="e-dtf-select-container">
                    <select className="e-dtf-select" value={minutes}
                            onChange={onValueChanged('minutes', onChange, value)}>
                        {range(0, 59, i =>
                            <option value={i} key={i}>{('0' + i).slice(-2)}</option>
                        )}
                    </select>
                    <small className="e-dtf-label">Minutes</small>
                </label>
            </fieldset>

            {/*
            <fieldset className="e-dtf-field-set">
                <label className="e-dtf-select-container">
                    <select className="e-dtf-select"
                            value={utcOffsetString}
                            disabled="true">
                        {listOfOffsets.map((offset, index) =>
                            <option value={offset} key={index}>{offset}</option>
                        )}
                    </select>
                    <small className="e-dtf-label">UTC Offset</small>
                </label>
            </fieldset>
            */}
        </div>
    )
};

export default DateTime;
