import co from 'co';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PublicPost from '../../react-components/public-post';
import PublicCategoryList from '../../react-components/public-category-list';

class PublicWrapper extends Component {

    static prepareForPreRendering({actions, store}) {
        return co(function* () {
            yield actions.loadPublicFrontBlog();
            yield actions.loadPublicCategories();
        });
    }

    render() {
        const { publicBlog, publicCategory, publicSiteInfo, children } = this.props;
        const blog = publicBlog.toObject();
        const categories = publicCategory.toArray();
        const rootDir = publicSiteInfo.get('publicDir');
        const root = rootDir === "" ? "/" : '/' + rootDir;

        return (
            <div className="module-header-footer-layout">
                <header className="m-hfl-header">
                    <h1><Link className="m-hfl-header-link" to={root}>{blog.name}</Link></h1>
                </header>
                <div className="m-hfl-body">
                    <div className="module-blog-layout">
                        <div className="m-bll-main">
                            {children}
                        </div>
                        <aside className="m-bll-sidebar">
                            <section className="module-section">
                                <PublicCategoryList categories={categories} rootDir={rootDir} />
                            </section>
                        </aside>
                    </div>
                </div>
                <footer className="m-hfl-footer">
                    <span>&copy;{blog.name}</span>
                </footer>
                <script dangerouslySetInnerHTML={{__html: blog.script_snippet}}></script>
            </div>
        );
    }
}

export default connect(
    state => ({
        publicBlog: state.publicBlog,
        publicCategory: state.publicCategory,
        publicSiteInfo: state.publicSiteInfo
    }),
    null
)(PublicWrapper);