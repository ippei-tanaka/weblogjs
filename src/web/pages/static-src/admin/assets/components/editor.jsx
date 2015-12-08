import React from 'react';
import Input from './form-field/field/input';
import Checkbox from './form-field/field/checkbox';
import CheckboxList from './form-field/field/checkbox-list';
import Label from './form-field/label';
import ErrorMessage from './form-field/error-message';


class Editor extends React.Component {

    constructor(props) {
        super(props);

        var values = {};
        var lists = {};

        this.listRetrievers = {};

        Object.keys(this.fieldSettings).forEach((fKey) => {
            var setting = this.fieldSettings[fKey];

            values[fKey] = setting.value;

            if (setting.list) {
                lists[fKey] = [];
                this.listRetrievers[fKey] = setting.list;
            }
        });

        this.state = {
            values: values,
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

    get buttonLabel() {
        return "Edit";
    }

    componentWillMount() {
        this.retrieveModel(this.props.id)
            .then((values) => this.setState({values: values}))
            .catch(() => {
            });

        Object.keys(this.listRetrievers).forEach((key) => {
            var retriever = this.listRetrievers[key];
            retriever().then((value) => {
                this.setListState(key, value);
            })
        });
    }

    retrieveModel(id) {
        return Promise.reject(null);
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
                var value = this.state.values[key];
                var list = this.state.lists[key];
                var error = this.state.errors[key];
                var element = null;

                switch (setting.type) {
                    case "text":
                    case "email":
                    case "password":
                    default:
                        element = (
                            <InputField
                                id={setting.id}
                                type={setting.type}
                                value={value}
                                onChange={value => this.setValueState(key, value)}
                            />
                        );
                        break;
                    case "checkbox-list":
                        element = (
                            <CheckboxList onChange={value => this.setValueState(key, value) }>
                                {list.map(
                                    (item, index) =>
                                    <Checkbox key={index}
                                              name={item.value}
                                              value={value.indexOf(item.value) !== -1}
                                              label={item.label}/>)}
                            </CheckboxList>
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
                    <button className="module-button"
                            type="submit">{this.buttonLabel}</button>
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