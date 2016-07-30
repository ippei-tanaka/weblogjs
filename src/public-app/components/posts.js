import React from 'react';
import PublicPost from "../../react-components/public-post";
import config from "../../config";
import urlResolver from "../../utilities/url-resolver";

const root = urlResolver.resolve(config.getValue('publicSiteRoot')) + "/";

export default ({posts}) => (
    <div>
        {posts.length !== 0 ? posts.map(post =>
            <section key={post._id} className="module-section">
                <PublicPost post={post} root={root}/>
            </section>
        ) : (
            <section className="module-section">No posts to show.</section>
        )}
    </div>
);