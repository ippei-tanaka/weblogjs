import React from 'react';
import PublicPost from "../../react-components/public-post";
import PublicPagination from "../../react-components/public-pagination";
import config from "../../config";
import path from "path";

const root = path.resolve(config.getValue('publicSiteRoot'), "./");

const paginationLinkBuilder = ({category, tag}) =>
{
    const categoryQuery = category ? `category/${category}` : "";
    const tagQuery = tag ? `tag/${tag}` : "";
    return (page) =>
    {
        const pageQuery = page > 1 ? `page/${page}` : "";
        return `${root}${categoryQuery}${tagQuery}${pageQuery}`;
    }
};

export default ({categories, category, tag, posts, page, totalPages}) => (
    <div>
        {posts.map(post =>
            <section key={post._id} className="module-section">
                <PublicPost categories={categories} post={post} root={root}/>
            </section>
        )}

        {posts.length === 0 ?
            <section className="module-section">
                No posts to show.
            </section>
            : null}

        {posts.length > 0 && totalPages > 1 && page > 0 ?
            <section className="module-section m-sct-short-section">
                <PublicPagination totalPages={totalPages}
                                  currentPage={page}
                                  linkBuilder={paginationLinkBuilder({category, tag})}/>
            </section> : null
        }
    </div>
);