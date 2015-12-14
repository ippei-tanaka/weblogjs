import React from 'react';
import ServerFacade from '../services/server-facade';
import PostAdder from './post-adder';


class PostEditor extends PostAdder {

    get title() {
        return "Edit the Post";
    }

    get okayButtonLabel() {
        return "Edit";
    }

    get fieldSettings() {
        var settings = super.fieldSettings;

        delete settings.password;

        return settings;
    }

    get buttonListElement() {

        var isDraft = this.getValueState('is_draft');

        return (
            <ul className="m-dte-button-list">
                <li className="m-dte-button-list-item">
                    <button className="module-button"
                            type="submit"
                            onClick={this.onPublishButtonClicked.bind(this)}>{isDraft ? 'Publish' : 'Update'}</button>
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

    retrieveModel(id) {
        return ServerFacade.getPost(id).then(data => {
            return {
                title: data.title,
                content: data.content,
                slug: data.slug,
                category: data.category,
                author: data.author,
                blog: data.blog,
                tags: data.tags,
                publish_date: data.publish_date,
                is_draft: data.is_draft,
                ___id_draft: null
            }
        });
    }

    sendToServer(values, id) {
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

        return ServerFacade.updatePost(id, data);
    }
}


export default PostEditor;