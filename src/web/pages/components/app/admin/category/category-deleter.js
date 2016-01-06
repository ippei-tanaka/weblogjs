import React from 'react';
import ServerFacade from '../../../../services/server-facade';
///import UserStore from '../../../../stores/user-store';
import Page from '../../../abstructs/page';
import Deleter from '../../../partials/deleter';


class CategoryDeleter extends Page {

    constructor(props) {
        super(props);
        this.state = {
            label: ""
        };
    }

    componentWillMount() {
        this.updateLabel();
    }

    render() {
        return (
            <Deleter title={this.title}
                     label={this.state.label}
                     onApproved={() => this.deleteModel()}
                     onCanceled={() => this.goToListPage()}/>
        );
    }

    updateLabel() {
        ServerFacade
            .getCategory(this.props.params.id)
            .then(category => {
                return category.name;
            })
            .then((values) => this.setState({label: values}))
            .catch(data => console.error(data));
    }

    deleteModel() {
        ServerFacade
            .deleteCategory(this.props.params.id)
            .then(() => this.goToListPage());
    }

    goToListPage() {
        this.context.history.pushState(null, "/admin/categories");
    }

    get title() {
        return "Delete Category";
    }

}


export default CategoryDeleter;