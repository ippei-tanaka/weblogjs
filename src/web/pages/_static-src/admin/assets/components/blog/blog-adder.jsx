import ServerFacade from '../../services/server-facade';
import React        from 'react';
import BlogEditor   from './blog-editor';


class BlogAdder extends BlogEditor {

    constructor(props) {
        super(props);
        this.state.slugPristine = true;
    }

    $showFlushMessage () {}

    $retrieveModelData () {}

    $sendModelData (data) {
        return ServerFacade.createBlog(data);
    }

    get $title () {
        return "Create a New Blog";
    }

    get $submitButtonLabel () {
        return "Create";
    }
}


export default BlogAdder;