import co from 'co';
import createStore from '../redux-store/create-store'
import createActions from '../redux-store/create-actions';
import {OK} from './../constants/status-codes';

export default class WebpackRouteHookRunner {

    constructor ({reducers, actions})
    {
        this._reducers = reducers;
        this._actions = actions;
    }

    run ({renderProps})
    {
        const { components, params } = renderProps;
        const store = createStore(this._reducers);
        const actions = createActions(store, this._actions);

        return co(function* ()
        {
            let title = "Weblog JS";
            let data = {};
            let statusCode = OK;

            for (const component of components)
            {
                if (component && component.prepareForPreRendering)
                {
                    data = yield component.prepareForPreRendering({store, actions, params, parentData: data});

                    if (data && data.title)
                    {
                        title = data.title;
                    }

                    if (data && data.statusCode)
                    {
                        statusCode = data.statusCode;
                    }
                }
            }

            return {title, store, statusCode};
        });
    }

};