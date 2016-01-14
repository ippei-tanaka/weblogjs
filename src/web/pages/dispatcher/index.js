import Constants from '../constants'
import Flux from 'flux';


class AppDispatcher extends Flux.Dispatcher {

    handleViewAction(action) {
        this.dispatch({
            source: Constants.PayloadSources.VIEW,
            action: action
        });
    }

    handleServerAction(action) {
        this.dispatch({
            source: Constants.PayloadSources.VIEW,
            action: action
        });
    }

}


export default new AppDispatcher();