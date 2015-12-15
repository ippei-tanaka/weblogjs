import ServerFacade from '../services/server-facade';
import Editor from './editor';
import React from 'react';


class PostAdder extends Editor {

    get title() {
        return "Create a New Post";
    }

    get okayButtonLabel() {
        return "Create";
    }

    get fieldSettings() {
        return {
            title: {
                id: "PostAdderTitleField",
                type: "text",
                label: "Title"
            },

            content: {
                id: "PostAdderContentField",
                type: "textarea",
                label: "Content"
            },

            slug: {
                id: "PostAdderDisplaySlugField",
                type: "text",
                label: "Slug"
            },

            category: {
                type: "select",
                label: "Category",
                list: () => ServerFacade.getCategories().then(
                    users => [{
                        value: "",
                        label: "-----"
                    }].concat(users.map(category => {
                        return {
                            value: category._id,
                            label: category.name
                        }
                    }))
                )
            },

            author: {
                type: "select",
                label: "Author",
                list: () => ServerFacade.getUsers().then(
                    users => [{
                        value: "",
                        label: "-----"
                    }].concat(users.map(user => {
                        return {
                            value: user._id,
                            label: user.display_name
                        }
                    }))
                )
            },

            blog: {
                type: "select",
                label: "Blog",
                list: () => ServerFacade.getBlogs().then(
                    blogs => [{
                        value: "",
                        label: "-----"
                    }].concat(blogs.map(blog => {
                        return {
                            value: blog._id,
                            label: blog.title
                        }
                    }))
                )
            },

            tags: {
                type: "tag-list",
                label: "Tags"
            },

            publish_date: {
                type: "datetime",
                label: "Published Date"
            }
        }
    }

    get buttonListElement() {

        var isDraft = this.getValueState('is_draft');

        return (
            <ul className="m-dte-button-list">
                <li className="m-dte-button-list-item">
                    <button className="module-button"
                            type="submit"
                            onClick={this.onPublishButtonClicked.bind(this)}>{isDraft ? 'Publish' : this.okayButtonLabel}</button>
                </li>
                <li className="m-dte-button-list-item">
                    <button className="module-button"
                            type="submit"
                            onClick={this.onDraftButtonClicked.bind(this)}>{isDraft ? 'Save as Draft' : 'Save & Unpublish'}</button>
                </li>
                <li className="m-dte-button-list-item">
                    <button className="module-button m-btn-alert"
                            onClick={this.onCancelButtonClicked.bind(this)}>{this.cancelButtonLabel}</button>
                </li>
            </ul>
        );
    }

    onPublishButtonClicked() {
        this.setValueState('___id_draft', false);
    }

    onDraftButtonClicked() {
        this.setValueState('___id_draft', true);
    }

    retrieveModel() {
        return Promise.resolve({
            title: "",
            content: "",
            slug: "",
            category: "",
            author: "",
            blog: "",
            tags: [],
            publish_date: new Date(),
            is_draft: null,
            ___id_draft: null
        });
    }

    sendToServer(values) {
        var data = {
            title: values.title.trim(),
            content: values.content.trim(),
            slug: values.slug.trim(),
            category: values.category || null,
            author: values.author || null,
            blog: values.blog || null,
            tags: values.tags,
            publish_date: values.publish_date,
            is_draft: values.___id_draft
        };

        return ServerFacade.createPost(data);
    }
}


export default PostAdder;