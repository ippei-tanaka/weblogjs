import ModelManager from "./model-manager";
import Post from "./models/post";


class PostManager extends ModelManager {

    constructor() {
        super(Post);
    }


    findBySlug(slug) {
        return this.findOne({slug: slug});
    }


    /**
     * @typedef {Object} PostObject
     * @property {string} title - The title of the post.
     * @property {string} content - The content of the post.
     * @property {string} author - The author ID of the post.
     * @property {string} publish_date - The publish date of the post.
     * @property {string} category - The category slug or ID of the post.
     * @property {string} slug - The slug of the post.
     * @property {[string]} [tags] - The tags of the post.
     */
    countByCategories (condition, sort) {
        return new Promise((resolve, reject) => {

            condition = condition || {};
            sort = sort || {};

            Post.aggregate([
                {
                    $match: condition
                },
                {
                    $group: {
                        _id: "$category",
                        count: {$sum: 1}
                    }
                },
                {
                    $sort: sort
                }
            ]).exec((err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        })
    }


    countByTag (condition, sort) {
        return new Promise((resolve, reject) => {

            condition = condition || {};
            sort = sort || {};

            Post.aggregate([
                {
                    $match: condition
                },
                {
                    $unwind: "$tags"
                },
                {
                    $group: {
                        _id: "$tags",
                        count: {$sum: 1}
                    }
                },
                {
                    $project: {
                        _id: false,
                        tag: "$_id",
                        count: true
                    }
                },
                {
                    $sort: sort
                }
            ]).exec((err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
    }
}


export default new PostManager();