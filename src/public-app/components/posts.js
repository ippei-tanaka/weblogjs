import React from 'react';
import PublicPost from "../../react-components/public-post";
import config from "../../config";

const root = config.getValue('publicSiteRoot');

export default ({posts, categories, authors}) => (
    <div>
        {posts.length !== 0 ? posts.map(post =>
            <section key={post._id} className="module-section">
                <PublicPost root={root}
                            _id={post._id}
                            title={post.title}
                            slug={post.slug}
                            content={post.content_edited}
                            category_id={post.category_id}
                            author_id={post.author_id}
                            published_date={post.published_date}
                            tags={post.tags}
                            categories={categories}
                            authors={authors}/>
            </section>
        ) : (
            <section className="module-section">No posts to show.</section>
        )}
    </div>
);