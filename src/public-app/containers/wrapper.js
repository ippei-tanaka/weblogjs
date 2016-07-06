import co from 'co';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import actions from '../actions';
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
        const { publicBlog, publicCategory } = this.props;
        const blog = publicBlog.toObject();
        const categories = publicCategory.toArray();

        return (
            <div className="module-header-footer-layout">
                <header className="m-hfl-header">
                    <h1><Link className="m-hfl-header-link" to="/">{blog.name}</Link></h1>
                </header>
                <div className="m-hfl-body">
                    <div className="module-blog-layout">
                        <div className="m-bll-main">
                            {this.props.children}
                        </div>
                        <aside className="m-bll-sidebar">
                            <section className="module-section">
                                <PublicCategoryList categories={categories} />
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
        publicCategory: state.publicCategory
    }),
    actions
)(PublicWrapper);