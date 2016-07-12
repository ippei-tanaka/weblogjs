import React from 'react';
import Moment from 'moment';
import { Link } from 'react-router';

export default (
    {
        rootDir,
        blog,
        post,
        categories,
        authors
        }
) =>
{

    const category = categories && post.category_id && categories[post.category_id] ? categories[post.category_id] : null;
    const author = authors && post.author_id && authors[post.author_id] ? authors[post.author_id] : null;

    rootDir = rootDir === "" ? "" : "/" + rootDir;

    return (
        <div className="module-post">

            <h2 className="m-pst-title"><Link className="m-pst-link"
                                              to={`${rootDir}/post/${post._id}/${post.slug}`}>{post.title}</Link></h2>

            <div className="m-pst-content">
                <article className="module-article"
                         dangerouslySetInnerHTML={{__html: post.content}}
                />
            </div>

            <date className="m-pst-date">Published on {Moment(post.published_date).format("MMM DD, YYYY")}</date>

            {author &&
                <div className="m-pst-author">Written by <Link className="m-pst-author-link"
                                                               to={`${rootDir}/author/${author.slug}`}>{author.display_name}</Link></div>
            }

            {category &&
                <div className="m-pst-category">Category: <Link className="m-pst-category-link"
                                                                to={`${rootDir}/category/${category.slug}`}>{category.name}</Link>
                </div>
            }

            {post.tags && post.tags.length > 0 ?
                <div className="m-pst-tag-container">
                    <ul className="m-pst-tags">
                        {post.tags.map(tag =>
                            <li key={`${post._id}_${tag}`} className="m-pst-tag">
                                <Link className="m-pst-tag-link"
                                      to={`${rootDir}/tag/${tag}`}>#{tag}</Link>
                            </li>
                        )}
                    </ul>
                </div>
                : null
            }

        </div>
    )
}
