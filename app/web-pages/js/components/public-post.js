import React from 'react';
import Moment from 'moment';
import { Link } from 'react-router';

export default ({
    post,
    categories,
    authors
    }) => {

    const category = categories && post.category_id && categories[post.category_id] ? categories[post.category_id] : null;

    return (
        <div className="module-post">

        <h2 className="m-pst-title"><Link className="m-pst-link" to={`/p/${post._id}/${post.slug}`}>{post.title}</Link></h2>

        <div className="m-pst-content">
            <article className="module-article">{post.content}</article>
        </div>

        <date className="m-pst-date">Published on {Moment(post.published_date).format("YYYY-MM-DD HH:mm Z")}</date>

        {authors && post.author_id && authors[post.author_id] ?
            <p className="m-pst-author">Written by <a className="m-pst-author-link" href={"#"}>{post.author.name}</a></p>
            : null
        }

        {category ?
            <p className="m-pst-category">Category: <a className="m-pst-category-link" href={`/c/${category.slug}`}>{category.name}</a></p>
            : null
        }

        {post.tags && post.tags.length > 0 ?
            <div className="m-pst-tag-container">
                <ul className="m-pst-tags">
                    {post.tags.map(tag =>
                        <li key={`${post._id}_${tag}`} className="m-pst-tag"><a className="m-pst-tag-link" href="#">#{tag}</a></li>
                    )}
                </ul>
            </div>
            : null
        }
    </div>
    )
}
