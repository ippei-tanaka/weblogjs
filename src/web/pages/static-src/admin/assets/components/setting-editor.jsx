import React from 'react';
import GlobalEvents from '../services/global-events';
import ServerFacade from '../services/server-facade';
import StringFormatter from '../services/string-formatter';
import Select from './form-field/field/select';
import Option from './form-field/field/option';
import Label from './form-field/label';
import ErrorMessage from './form-field/error-message';


class SettingEditor extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            errors: {},
            setting: {},
            blogs: [],
            flush: ""
        };
    }

    componentWillMount () {
        ServerFacade.getSetting().then(function (setting) {
            this.setState({setting: setting});
        }.bind(this));

        ServerFacade.getBlogs().then(function (blogs) {
            this.setState({blogs: blogs});
        }.bind(this));
    }

    render () {
        return (
            <form className="module-data-editor" onSubmit={this.onSubmit.bind(this)}>
                <h2 className="m-dte-title">Setting</h2>

                <div className="m-dte-field-container">
                    <Label htmlFor="SettingEditorFrontPageField">
                        Front Page
                    </Label>
                    <Select id="SettingEditorFrontPageField"
                            value={this.state.setting.front}
                            autoFocus={true}
                            onChange={val => this.setState((state) => { state.setting.front = val || null })}>

                        <Option key="null" value="">-----</Option>

                        {this.state.blogs.map(blog => {
                        return <Option key={blog._id} value={blog._id}>{blog.title}</Option>}
                            )}

                    </Select>
                    <ErrorMessage error={this.state.errors.front}/>
                </div>

                { this.state.flush ? (
                    <div className="m-dte-field-container">
                        <div className="m-dte-flush-message">
                            {this.state.flush}
                        </div>
                    </div>
                        ) : null}

                <div className="m-dte-field-container">
                    <button className="module-button"
                            type="submit">Edit
                    </button>
                </div>
            </form>
        );
    }

    onSubmit (e) {
        e.preventDefault();

        ServerFacade.updateSetting(this.state.setting)
            .then(() => {
                this.setState((state) => {
                    state.errors.front = null;
                    state.flush = "Succeeded to update the setting!";
                });
            })
            .catch(data => {
                this.setState((state) => {
                    state.errors = data.errors;
                    state.flush = "";
                });
            });
    }

}


export default SettingEditor;