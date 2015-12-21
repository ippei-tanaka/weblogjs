import ServerFacade from '../../services/server-facade';
import React        from 'react';
import PostEditor   from './post-editor';


class PostAdder extends PostEditor {

    constructor(props) {
        super(props);
        this.state.slugPristine = true;
    }

    $showFlushMessage () {}

    $retrieveModelData () {}

    $sendModelData (data) {
        return ServerFacade.createPost(data);
    }

    get $title () {
        return "Create a New Post";
    }

    get $submitButtonLabel () {
        return "Create";
    }
}

export default PostAdder;