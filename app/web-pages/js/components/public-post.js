import React from 'react';
import Moment from 'moment';
import { Link } from 'react-router';

export default ({
    post,
    author,
    category
    }) =>
    <div className="module-post">

        <h2 className="m-pst-title"><a className="m-pst-link" href="#">{post.title}</a></h2>

        <div className="m-pst-content">
            <article className="module-article">{post.content}</article>
        </div>

        <date className="m-pst-date">Published on {post.published_date}</date>

        {author ?
            <p className="m-pst-author">Written by <a className="m-pst-author-link" href={"#"}>{author.name}</a></p>
            : null
        }

        {category ?
            <p className="m-pst-category">Category: <a className="m-pst-category-link" href={"#"}>{category.name}</a></p>
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
