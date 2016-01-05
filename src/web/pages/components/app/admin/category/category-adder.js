import React        from 'react';
import ServerFacade from '../../../../services/server-facade';
import { FieldSet, Input } from '../../../form';
import CategoryEditor   from './category-editor';


class CategoryAdder extends CategoryEditor {

    constructor(props) {
        super(props);
        this.state.slugPristine = true;
    }

    showFlushMessage () {}

    retrieveModelData () {}

    sendModelData (data) {
        return ServerFacade.createCategory(data);
    }

    get title () {
        return "Create a New Category";
    }

    get submitButtonLabel () {
        return "Create";
    }
}


export default CategoryAdder;