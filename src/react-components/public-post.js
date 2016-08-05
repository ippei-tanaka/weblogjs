import React from 'react';
import Moment from 'moment';

export default ({
    root,

    _id,
    title,
    slug,
    content,
    category_id,
    author_id,
    published_date,
    tags,

    categories = {},
    authors = {}
}) =>
{
    const category = Array.isArray(categories)
                        ? categories.find(c => String(c._id) === String(category_id))
                        : categories[category_id];
    const author = Array.isArray(authors)
                        ? authors.find(a => String(a._id) === String(author_id))
                        : authors[author_id];

    return (
        <div className="module-post">

            <h2 className="m-pst-title">
                <a className="m-pst-link"
                   href={`${root}post/${slug}`}>
                    {title}
                </a>
            </h2>

            <div className="m-pst-content">
                <article className="module-article"
                         dangerouslySetInnerHTML={{__html: content}}
                />
            </div>

            <date className="m-pst-date">Published on {Moment(published_date).format("MMM DD, YYYY")}</date>

            {author ?
                <div className="m-pst-author">Written by <a className="m-pst-author-link"
                       href={`${root}author/${author.slug}`}>{author.display_name}</a>
                </div> : null
            }

            {category ?
                <div className="m-pst-category">Category: <a className="m-pst-category-link"
                                                             href={`${root}category/${category.slug}`}>{category.name}</a>
                </div> : null
            }

            {tags && tags.length > 0 ?
                <div className="m-pst-tag-container">
                    <ul className="m-pst-tags">
                        {tags.map(tag =>
                            <li key={`${_id}_${tag}`} className="m-pst-tag">
                                <a className="m-pst-tag-link"
                                   href={`${root}tag/${tag}`}>#{tag}</a>
                            </li>
                        )}
                    </ul>
                </div>
                : null
            }

        </div>
    )
}
