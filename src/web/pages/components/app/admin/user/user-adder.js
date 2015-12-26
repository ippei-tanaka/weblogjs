import React        from 'react';
import ServerFacade from '../../../../services/server-facade';
import { FieldSet, Input } from '../../../form';
import UserEditor   from './user-editor';


class UserAdder extends UserEditor {

    constructor(props) {
        super(props);
        this.state.slugPristine = true;
    }

    showFlushMessage () {}

    retrieveModelData () {}

    sendModelData (data) {
        return ServerFacade.createUser(data);
    }

    get passwordElement () {
        return (
            <FieldSet label="Password"
                      error={this.state.errors.password}>
                <Input value={this.state.values.password}
                       type="password"
                       onChange={v => this.setState(s => { s.values.password = v })}/>
            </FieldSet>
        );
    }

    get title () {
        return "Create a New User";
    }

    get submitButtonLabel () {
        return "Create";
    }
}


export default UserAdder;