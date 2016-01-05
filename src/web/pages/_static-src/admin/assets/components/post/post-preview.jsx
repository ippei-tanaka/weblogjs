import React from 'react';


class PostPreview extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <iframe src={`/post/${this.props.slug}`}></iframe>
        );
    }

    static get defaultProps() {
        return {
            slug: null
        }
    };

}


export default PostPreview;