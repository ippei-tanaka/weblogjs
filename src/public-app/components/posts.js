import React from 'react';
import PublicPost from "../../react-components/public-post";
import config from "../../config";

const root = config.getValue('publicSiteRoot');

export default ({posts, categories, authors}) => (
    <div>
        {posts.length !== 0 ? posts.map(post =>
            <section key={post._id} className="module-section">
                <PublicPost post={post}
                            root={root}
                            categories={categories}
                            authors={authors}/>
            </section>
        ) : (
            <section className="module-section">No posts to show.</section>
        )}
    </div>
);