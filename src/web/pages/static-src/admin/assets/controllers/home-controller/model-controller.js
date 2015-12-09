import PopUp        from '../../components/popup';
import LocationBar  from '../../components/location-bar';
import Mounter      from '../../services/react-component-mounter';
import Event        from '../../services/event';

class ModelController {

    constructor() {
        this.onClickListLocation = new Event();
        this.onClickAddButton = new Event();
        this.onClickEditButton = new Event();
        this.onClickDeleteButton = new Event();
        this.onCompleteAdding = new Event();
        this.onCompleteEditing = new Event();
        this.onCompleteDeleting = new Event();


        this._listMounter = new Mounter(this.List, 'main-content-container');
        this._adderMounter = new Mounter(this.Adder, 'main-content-container');
        this._editorMounter = new Mounter(this.Editor, 'main-content-container');
        this._deleterMounter = new Mounter(this.Deleter, 'main-content-container');

        this._listMounter.props = {
            addButtonClicked: () => {
                this.onClickAddButton.fire();
            },

            editButtonClicked: id => {
                this.onClickEditButton.fire(id);
            },

            deleteButtonClicked: id => {
                this.onClickDeleteButton.fire(id);
            }
        };

        this._adderMounter.props = {
            onComplete: () => {
                this._adderMounter.unmount();
                this.onCompleteAdding.fire();
            }
        };

        this._editorMounter.props = {
            onComplete: () => {
                this._editorMounter.unmount();
                this.onCompleteEditing.fire();
            }
        };

        this._deleterMounter.props = {
            onComplete: () => {
                this._deleterMounter.unmount();
                this.onCompleteDeleting.fire();
            }
        };


        this._locationBarMounter = new Mounter(LocationBar, 'location-bar-container');

    }

    get List() {
        throw new Error("Override List.");
    }

    get Adder() {
        throw new Error("Override Adder.");
    }

    get Editor() {
        throw new Error("Override Editor.");
    }

    get Deleter() {
        throw new Error("Override Deleter.");
    }

    get modelName() {
        throw new Error("Override modelName.");
    }

    get locationsForList() {
        return [
            {
                label: "Home"
            },
            {
                label: `${this.modelName} List`
            }
        ];
    }

    get locationsForNonList() {
        return [
            {
                label: "Home"
            },
            {
                label: `${this.modelName} List`,
                link: true,
                onClick: () => { this.onClickListLocation.fire(); }
            },
            {
                label: `${this.modelName} Editor`
            }
        ];
    }

    showList() {
        this._listMounter.mount();
        this._locationBarMounter.props.locations = this.locationsForList;
        this._locationBarMounter.mount();
    }

    showAdder() {
        this._adderMounter.mount();
        this._locationBarMounter.props.locations = this.locationsForNonList;
        this._locationBarMounter.mount();
    }

    showEditor(id) {
        this._editorMounter.props.id = id;
        this._editorMounter.mount();
        this._locationBarMounter.props.locations = this.locationsForNonList;
        this._locationBarMounter.mount();
    }

    showDeleter(id) {
        this._deleterMounter.props.id = id;
        this._deleterMounter.mount();
        this._locationBarMounter.props.locations = this.locationsForNonList;
        this._locationBarMounter.mount();
    }
}

export default ModelController;