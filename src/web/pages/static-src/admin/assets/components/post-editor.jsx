import ServerFacade from '../services/server-facade';
import PostAdder from './post-adder';


class PostEditor extends PostAdder {

    get title() {
        return "Edit the Post";
    }

    get okayButtonLabel() {
        return "Update";
    }

    get fieldSettings() {
        var settings = super.fieldSettings;

        delete settings.password;

        return settings;
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