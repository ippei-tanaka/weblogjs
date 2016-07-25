import React from 'react';
import Moment from 'moment';
import { Link } from 'react-router';

export default ({
    root,
    post,
    categories,
    authors
}) =>
{
    const category = categories && post.category_id && categories[post.category_id] ? categories[post.category_id] : null;
    const author = authors && post.author_id && authors[post.author_id] ? authors[post.author_id] : null;

    return (
        <div className="module-post">

            <h2 className="m-pst-title"><a className="m-pst-link"
                                           href={`${root}post/${post.slug}`}>{post.title}</a></h2>

            <div className="m-pst-content">
                <article className="module-article"
                         dangerouslySetInnerHTML={{__html: post.content}}
                />
            </div>

            <date className="m-pst-date">Published on {Moment(post.published_date).format("MMM DD, YYYY")}</date>

            {author &&
            <div className="m-pst-author">Written by <Link className="m-pst-author-link"
                                                           to={`${root}author/${author.slug}`}>{author.display_name}</Link>
            </div>
            }

            {category &&
            <div className="m-pst-category">Category: <Link className="m-pst-category-link"
                                                            to={`${root}category/${category.slug}`}>{category.name}</Link>
            </div>
            }

            {post.tags && post.tags.length > 0 ?
                <div className="m-pst-tag-container">
                    <ul className="m-pst-tags">
                        {post.tags.map(tag =>
                            <li key={`${post._id}_${tag}`} className="m-pst-tag">
                                <Link className="m-pst-tag-link"
                                      to={`${root}tag/${tag}`}>#{tag}</Link>
                            </li>
                        )}
                    </ul>
                </div>
                : null
            }

        </div>
    )
}
