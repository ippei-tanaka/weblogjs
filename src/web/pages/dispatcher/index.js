import Constants from '../constants'
import Flux from 'flux';


class AppDispatcher extends Flux.Dispatcher {

    handleViewAction(action) {
        console.log("View Action - " + action.actionType);

        this.dispatch({
            source: Constants.PayloadSources.VIEW,
            action: action
        });
    }

    handleServerAction(action) {
        console.log("Server Action - " + action.actionType);

        this.dispatch({
            source: Constants.PayloadSources.VIEW,
            action: action
        });
    }

}


export default new AppDispatcher();