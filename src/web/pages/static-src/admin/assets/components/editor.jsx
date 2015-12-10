import React from 'react';
import Input from './form-field/field/input';
import Checkbox from './form-field/field/checkbox';
import CheckboxList from './form-field/field/checkbox-list';
import Select from './form-field/field/select';
import Option from './form-field/field/option';
import TagList from './form-field/field/tag-list';
import Datetime from './form-field/field/datetime';
import Textarea from './form-field/field/textarea';
import Label from './form-field/label';
import ErrorMessage from './form-field/error-message';


class Editor extends React.Component {

    constructor(props) {
        super(props);

        var lists = {};

        this.listRetrievers = {};

        Object.keys(this.fieldSettings).forEach((fKey) => {
            var setting = this.fieldSettings[fKey];

            if (setting.list) {
                lists[fKey] = [];
                this.listRetrievers[fKey] = setting.list;
            }
        });

        this.state = {
            values: {},
            lists: lists,
            errors: {}
        };
    }

    get fieldSettings() {
        return {};
    }

    get title() {
        return "Edit Something";
    }

    get okayButtonLabel() {
        return "Edit";
    }

    get cancelButtonLabel() {
        return "Cancel";
    }

    componentWillMount() {
        this.retrieveModel(this.props.id)
            .then((values) => this.setState({values: values}))
            .catch(data => console.error(data));

        Object.keys(this.listRetrievers).forEach((key) => {
            var retriever = this.listRetrievers[key];
            retriever().then((value) => {
                this.setListState(key, value);
            });
        });
    }

    retrieveModel(id) {
        return Promise.reject("Implement retrieveModel(id).");
    }

    setValueState(name, value) {
        this.setState((previousState) => {
            previousState.values[name] = value;
            return previousState.values;
        });
    }

    setListState(name, value) {
        this.setState((previousState) => {
            previousState.lists[name] = value;
            return previousState.lists;
        });
    }

    render() {

        var fields = Object.keys(this.fieldSettings).map(
            (key, index) => {
                var setting = this.fieldSettings[key];
                var val = this.state.values[key];
                var list = this.state.lists[key];
                var error = this.state.errors[key];
                var element = null;

                switch (setting.type) {
                    case "text":
                    case "email":
                    case "password":
                    default:
                        element = (
                            <Input
                                id={setting.id}
                                type={setting.type}
                                value={val}
                                onChange={v => this.setValueState(key, v)}
                            />
                        );
                        break;
                    case "textarea":
                        element = (
                            <Textarea onChange={v => this.setValueState(key, v) }
                                      value={val} />
                        );
                        break;
                    case "checkbox-list":
                        element = (
                            <CheckboxList onChange={v => this.setValueState(key, v) }>
                                {list.map(
                                    (item, index) =>
                                    <Checkbox key={index}
                                              name={item.value}
                                              value={val ? val.indexOf(item.value) !== -1 : false}
                                              label={item.label}/>)}
                            </CheckboxList>
                        );
                        break;
                    case "select":
                        element = (
                            <Select onChange={v => this.setValueState(key, v) }
                                    value={val}>
                                {list.map(
                                    (item, index) =>
                                    <Option key={index}
                                            value={item.value}>
                                        {item.label}
                                    </Option>
                                    )}
                            </Select>
                        );
                        break;
                    case "tag-list":
                        element = (
                            <TagList onChange={v => this.setValueState(key, v) }
                                     value={val} />
                        );
                        break;
                    case "datetime":
                        element = (
                            <Datetime onChange={v => this.setValueState(key, v) }
                                      value={val} />
                        );
                        break;
                }

                return (
                    <div key={index} className="m-dte-field-container">
                        <Label htmlFor={setting.id}>
                            {setting.label}
                        </Label>
                        {element}
                        <ErrorMessage error={error}/>
                    </div>
                );
            }
        );

        return (
            <form className="module-data-editor" onSubmit={this.onSubmit.bind(this)}>
                <h2 className="m-dte-title">{this.title}</h2>
                {fields}
                <div className="m-dte-field-container">
                    <ul className="m-dte-button-list">
                        <li className="m-dte-button-list-item">
                            <button className="module-button"
                                    type="submit">{this.okayButtonLabel}</button>
                        </li>
                        <li className="m-dte-button-list-item">
                            <button className="module-button m-btn-alert"
                                    onClick={this.onCancelButtonClicked.bind(this)}>{this.cancelButtonLabel}</button>
                        </li>
                    </ul>
                </div>
            </form>
        );
    }

    onSubmit(e) {
        e.preventDefault();
        this.sendToServer(this.state.values, this.props.id)
            .then(() => {
                this.props.onComplete();
            })
            .catch(data =>
                this.setState({
                    errors: data.errors
                })
            );
    }

    onCancelButtonClicked(e) {
        e.preventDefault();
        this.props.onComplete();
    }

    sendToServer(values) {
        return Promise.reject(null);
    }

}


Editor.defaultProps = {
    id: "",
    onComplete: function () {
    }
};


export default Editor;